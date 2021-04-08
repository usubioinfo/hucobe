import ExpressionService from '@services/expression.service';
import { Request, Response } from 'express';
import { IExpression } from '@models/expression.model';

import ExpResultService from '@services/exp-result.service';
import { ExpResult } from '@schemas/exp-result.schema';
import { IExpResult } from '@models/exp-result.model';

import { performance } from 'perf_hooks';

import cache from 'memory-cache';

type ExpressionReq = {
  pathogenProteins: string[],
  pathogen: string,
  interactionCategory: string,
  interactionType: string,
  genes: string[],
  tissues: string[]
}

export const getExpResultIdRoute = async (req: Request, res: Response) => {
  let expResult = new ExpResult({
    expressions: [],
    createdAt: new Date(),
    reqTime: 0
  });

  const saved = await ExpResultService.saveModel(expResult) as IExpResult;

  res.json({success: true, payload: saved._id});
}

export const getExpResultRoute = async (req: Request, res: Response) => {
  const expResultId = req.params.id;

  if (!expResultId) {
    return res.json({success: false, msg: 'Invalid ID!'});
  }

  const result = await ExpResultService.findOneModelByQuery({_id: expResultId});

  if (result) {
    return res.json({success: true, payload: result});
  }

  return res.json({success: false, msg: 'Result does not exist!'});
}

// this needs a request body, so this is a POST request
export const getExpressionsByParamsRoute = async (req: Request, res: Response) => {

  // Shallow clone, there are no complex data types used so this is okay
  const body: ExpressionReq = JSON.parse(JSON.stringify(req.body));
  console.log(body);

  const expressions: IExpression[] = [];
  let expResult = await ExpResultService.findOneModelByQuery({_id: req.body.expId}) as IExpResult;
  const time0 = performance.now();

  for (let gene of body.genes) {
    for (let patProtein of body.pathogenProteins) {
      const query = {
        pathogen: body.pathogen,
        pathogenProtein: patProtein,
        interactionCategory: body.interactionCategory,
        interactionType: {'$in': body.interactionType},
        gene: gene,
        tissueExpression: {'$in': body.tissues}
      }
      const results = await ExpressionService.findModelsByQuery(query);
      if (results) {
        expressions.push(...results);
      }
    }
  }

  const time1 = performance.now();

  expResult.reqTime = time1 - time0;
  expResult.expressions = expressions;

  await ExpResultService.saveChangedModel(expResult, ['reqTime', 'expressions']);

  console.log('done')
  console.log(expressions);

  if (expressions.length) {
    return res.status(200).json({success: true, payload: expressions});
  }

  return res.status(500).json({success: false, msg: 'Something went wrong.'});

}

export const getTissueAnnotationsRoute = async (req: Request, res: Response) => {

  const cachedAnnotations = cache.get('tissueAnnotations');

  if (cachedAnnotations) {
    console.log(`Received cached annotations: ${cachedAnnotations}`);
    return res.json({success: true, payload: cachedAnnotations.split(',')});
  }

  let annotations = await ExpressionService.getDistinct('tissueExpression');

  annotations = annotations.filter((item: string |  null) => {
    if (item) {
      return true;
    }

    return false;
  });

  console.log(`Caching annotations: ${annotations}`);
  let millisInAWeek = 604800000;
  cache.put('tissueAnnotations', annotations.join(','), millisInAWeek, async () => {
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
