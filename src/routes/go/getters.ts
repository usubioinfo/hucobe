import GoService from '@services/go-enrichment.service';
import { Request, Response } from 'express';
import { IGoEnrichment } from '@models/go-enrichment.model';

import ResultService from '@services/result.service';
import { IResult } from '@models/result.model';

import { performance } from 'perf_hooks';

export const getGoEnrichmentRoute = async (req: Request, res: Response) => {
  const body = req.body;

  let result = await ResultService.findOneModelByQuery({_id: req.body.expId}) as IResult;
  const time0 = performance.now();

  const query = {
    pathogen: body.pathogen,
    interactionCategory: body.interactionCategory,
    gene: { '$in': body.genes },
    category: { '$in': body.category }
  };

  const enrichments = await GoService.findModelsByQuery(query, {}, 19000);

  if (!enrichments) {
    return res.status(500).json({success: false, msg: 'Request failed'});
  }

  const time1 = performance.now();

  result.reqTime = time1 - time0;
  result.results = enrichments;

  return res.json({success: true, payload: enrichments});
}

export const createGoIndexRoute = async (req: Request, res: Response) => {
  let en = await GoService.findModelsByQuery({}, {}, 19000) as IGoEnrichment[];

  let count = en.length;

  for (let enrichment of en) {
    enrichment.genes = enrichment.geneId.split('/');
    await GoService.saveChangedModel(enrichment, ['genes']);
  }

  return res.json({success: true, count});
}
