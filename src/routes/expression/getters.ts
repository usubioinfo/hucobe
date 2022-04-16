import dotenv from 'dotenv';

import ExpressionService from '@services/expression.service';
import { Request, Response } from 'express';
import { IExpression } from '@models/expression.model';

import ResultService from '@services/result.service';
import { IResult } from '@models/result.model';

import { performance } from 'perf_hooks';
dotenv.config();
require('dotenv-defaults/config');

const CACHE_TIME = parseInt((process.env.ANNOTATION_CACHE_TIME as string));

import cache from 'memory-cache';

type ExpressionReq = {
  pathogenProteins: string[],
  pathogen: string,
  interactionCategory: string,
  interactionType: string,
  genes: string[],
  tissues: string[]
}

// this needs a request body, so this is a POST request
export const getExpressionsByParamsRoute = async (req: Request, res: Response) => {

  // Shallow clone, there are no complex data types used so this is okay
  const body: ExpressionReq = JSON.parse(JSON.stringify(req.body));
  console.log(body);

  const expressions: IExpression[] = [];
  let result = await ResultService.findOneModelByQuery({_id: req.body.expId}) as IResult;
  const time0 = performance.now();

  const query = {
    pathogen: body.pathogen,
    pathogenProtein: {'$in': body.pathogenProteins},
    interactionCategory: body.interactionCategory,
    interactionType: {'$in': body.interactionType},
    gene: {'$in': body.genes},
    tissueExpression: {'$in': body.tissues}
  }

  const testQuery = {
    pathogen: body.pathogen,
    pathogenProtein: {'$in': body.pathogenProteins},
    interactionCategory: body.interactionCategory,
    interactionType: {'$in': body.interactionType},
    gene: {'$in': body.genes},
    tissueExpression: {'$in': body.tissues}
  }

  console.log(query);

  const results = await ExpressionService.findModelsByQuery(query, {}, 19000);
  if (results) {
    expressions.push(...results);
  }

  const testRes = await ExpressionService.findModelsByQuery(testQuery);

  const countMap: Record<string, number> = {
    interolog: 0,
    domain: 0,
    both: 0
  }

  testRes?.forEach(item => {
    countMap[item.interactionType] += 1;
  });

  console.log(countMap);


  const time1 = performance.now();

  result.reqTime = time1 - time0;
  result.results = expressions;

  await ResultService.saveChangedModel(result, ['reqTime', 'results']);

  console.log('done')
  // console.log(expressions);

  if (expressions.length) {
    return res.status(200).json({success: true, payload: expressions});
  }

  return res.status(500).json({success: false, msg: 'Something went wrong.'});

}

export const getTissueAnnotationsRoute = async (req: Request, res: Response) => {

  const cachedAnnotations = cache.get('tissueAnnotations');

  if (cachedAnnotations) {
    console.log(`Received cached tissue annotations.`);
    return res.json({success: true, payload: cachedAnnotations.split(',')});
  }

  let annotations = await ExpressionService.getDistinct('tissueExpression');

  annotations = annotations.filter((item: string |  null) => {
    if (item) {
      return true;
    }

    return false;
  });

  console.log(`Caching tissue annotations.`);
  cache.put('tissueAnnotations', annotations.join(','), CACHE_TIME, async () => {
    let annotations = await ExpressionService.getDistinct('tissueExpression');

    annotations = annotations.filter((item: string |  null) => {
      if (item) {
        return true;
      }

      return false;
    });
  });

  return res.json({success: true, payload: annotations});
}

export const testRoute = async (req: Request, res: Response) => {
  return res.send(`${req.params.test}`);
}
