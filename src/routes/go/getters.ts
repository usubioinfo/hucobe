import dotenv from 'dotenv';

import { Request, Response } from 'express';
import GoService from '@services/go-enrichment.service';
import { IGoEnrichment } from '@models/go-enrichment.model';

import InteractionService from '@services/interaction.service';
import { IInteraction } from '@models/interaction.model';

import ResultService from '@services/result.service';
import { IResult } from '@models/result.model';

import cache from 'memory-cache';

import { performance } from 'perf_hooks';
dotenv.config();
require('dotenv-defaults/config');

const CACHE_TIME = parseInt((process.env.ANNOTATION_CACHE_TIME as string));

export const getGoEnrichmentRoute = async (req: Request, res: Response) => {
  const body = req.body;
  console.log(body);

  let result = await ResultService.findOneModelByQuery({_id: req.body.expId}) as IResult;
  const time0 = performance.now();

  const query = {
    pathogen: body.pathogen,
    interactionCategory: body.interactionCategory,
    genes: { '$in': body.genes },
    category: { '$in': body.goTerms }
  };

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

export const getGoAnnotationsRoute = async (req: Request, res: Response) => {
  const cachedAnnotations = cache.get('goDesc');

  if (cachedAnnotations) {
    console.log(`Received cached GO annotations.`);
    return res.json({success: true, payload: cachedAnnotations.split(',')});
  }

  let annotations = await GoService.getDistinct('description');

  annotations = annotations.filter((item: string |  null) => {
    if (item) {
      return true;
    }

    return false;
  });

  console.log(`Caching GO annotations.`);

  cache.put('goDesc', annotations.join(','), CACHE_TIME, async () => {
    let annotations = await GoService.getDistinct('tissueExpression');

    annotations = annotations.filter((item: string |  null) => {
      if (item) {
        return true;
      }

      return false;
    });
  });

  return res.json({success: true, payload: annotations});
}

export const searchGoAnnotationsRoute = async (req: Request, res: Response) => {
  const body = req.body;

  const query = { '$text': { '$search': body.searchTerms } };

  let terms = await GoService.findModelsByQuery(query, {}, 60);

  return res.json({success: true, payload: terms});
}
