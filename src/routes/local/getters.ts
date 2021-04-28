import dotenv from 'dotenv';

import { Request, Response } from 'express';
import GoService from '@services/go-enrichment.service';

import LocalService from '@services/local.service';
import { ILocal } from '@models/local.model';

import InteractionService from '@services/interaction.service';

import ResultService from '@services/result.service';
import { IResult } from '@models/result.model';

import cache from 'memory-cache';

import { performance } from 'perf_hooks';
dotenv.config();
require('dotenv-defaults/config');

const CACHE_TIME = parseInt((process.env.ANNOTATION_CACHE_TIME as string));

export const getLocalRoute = async (req: Request, res: Response) => {
  const body = req.body;
  console.log(body);

  let result = await ResultService.findOneModelByQuery({_id: req.body.expId}) as IResult;
  const time0 = performance.now();

  const query: any = {
    pathogen: body.pathogen,
    interactionCategory: body.interactionCategory,
    gene: { '$in': body.genes },
    category: { '$in': body.goTerms }
  };

  if (body.descriptions) {
    query['description'] = { '$in': body.descriptions };
  }

  console.log(query);

  const enrichments = await GoService.findModelsByQuery(query, {}, 19000);

  const intQuery = {
    gene: { '$in': body.genes},
    pathogenProtein: { '$in': body.pathogenProteins },
    pathogen: body.pathogen,
    interactionCategory: body.interactionCategory,
    interactionType: body.interactionType
  }

  const interactions = await InteractionService.findModelsByQuery(intQuery, {}, 19000);

  if (!enrichments || !interactions) {
    return res.status(500).json({success: false, msg: 'Request failed'});
  }

  const time1 = performance.now();

  result.reqTime = time1 - time0;
  result.results = enrichments;

  await ResultService.saveChangedModel(result, ['reqTime', 'results']);

  return res.json({success: true, payload: {enrichments, interactions}});
}

export const getLocalAnnotationsRoute = async (req: Request, res: Response) => {
  const cacheKey = 'localDesc';
  const cachedAnnotations = cache.get(cacheKey);

  if (cachedAnnotations) {
    console.log(`Received cached Local annotations.`);
    return res.json({success: true, payload: cachedAnnotations.split(',')});
  }

  let annotations = await LocalService.getDistinct('location');

  annotations = annotations.filter((item: string |  null) => {
    if (item) {
      return true;
    }

    return false;
  });

  console.log(`Caching Local annotations.`);

  cache.put(cacheKey, annotations.join(','), CACHE_TIME, async () => {
    let annotations = await LocalService.getDistinct('location');

    annotations = annotations.filter((item: string |  null) => {
      if (item) {
        return true;
      }

      return false;
    });
  });

  return res.json({success: true, payload: annotations});
}