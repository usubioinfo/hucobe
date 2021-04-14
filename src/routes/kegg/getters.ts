import { Request, Response } from 'express';
import KeggService from '@services/kegg-enrichment.service';

import InteractionService from '@services/interaction.service';

import ResultService from '@services/result.service';
import { IResult } from '@models/result.model';

import { performance } from 'perf_hooks';

export const getKeggEnrichmentRoute = async (req: Request, res: Response) => {
  const body = req.body;

  let result = await ResultService.findOneModelByQuery({_id: body.expId}) as IResult;
  const time0 = performance.now();

  const query = {
    pathogen: body.pathogen,
    interactionCategory: body.interactionCategory,
    genes: { '$in': body.genes }
  }

  console.log(query);

  const enrichments = await KeggService.findModelsByQuery(query, {}, 5000);

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
};
