import { Request, Response } from 'express';
import GoService from '@services/go-enrichment.service';
import { IGoEnrichment } from '@models/go-enrichment.model';

import InteractionService from '@services/interaction.service';
import { IInteraction } from '@models/interaction.model';

import ResultService from '@services/result.service';
import { IResult } from '@models/result.model';

import { performance } from 'perf_hooks';

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

  return res.json({success: true, payload: {enrichments, interactions}});
}

export const createGoIndexRoute = async (req: Request, res: Response) => {

  if (!req.body.password || req.body.password !== '23fafjkg') {
    return res.status(401).json({success: false, msg: 'Unauthorized'});
  }

  let en = await GoService.findModelsByQuery({}, {}, 19000) as IGoEnrichment[];

  let count = en.length;

  for (let enrichment of en) {
    enrichment.genes = enrichment.geneId.split('/');
    await GoService.saveChangedModel(enrichment, ['genes']);
  }

  return res.json({success: true, count});
}
