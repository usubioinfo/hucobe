import dotenv from 'dotenv';

import { Request, Response } from 'express';
import GoService from '@services/go-enrichment.service';
import { IGoEnrichment } from '@models/go-enrichment.model';

import InteractionService from '@services/interaction.service';

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

  console.log(enrichments);

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

  const sendData: any[] = [];
  for (let enrichment of enrichments) {
    let interaction = interactions.find(int => {
      // console.log(int)
      // console.log(int.gene);
      // console.log(enrichment.pAdjust);
      return int.gene === enrichment.gene;
    });

    if (interaction) {
      sendData.push({
        humanProtein : interaction.humanProtein,
        pathogenProtein : interaction.pathogenProtein,
      	isolate : interaction.isolate,
      	pLength : interaction.pLength,
      	hLength : interaction.hLength,
      	interactionType : interaction.interactionType,
        gene: enrichment.gene,
        _id: enrichment._id,
        goId: enrichment.goId,
        description: enrichment.description,
        fdr: enrichment.pAdjust,
        pathogen: enrichment.pathogen,
        interactionCategory: enrichment.interactionCategory,
        confidence: interaction.confidence,
        hInteractor: interaction.hInteractor,
        pInteractor: interaction.pInteractor,
        publication: interaction.publication
      });
    } else {
      sendData.push({
        pathogenProtein : '',
      	isolate : '',
      	pLength : 0,
      	hLength : 0,
      	interactionType : '',
        gene: enrichment.gene,
        _id: enrichment._id,
        goId: enrichment.goId,
        description: enrichment.description,
        fdr: enrichment.pAdjust,
        pathogen: enrichment.pathogen,
        interactionCategory: enrichment.interactionCategory
      });
    }
  }

  const time1 = performance.now();

  result.reqTime = time1 - time0;
  result.results = sendData;

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
    let annotations = await GoService.getDistinct('description');

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

  let query = { '$text': { '$search': `${body.searchTerms}`, '$caseSensitive': false } };

  let results = await GoService.findModelsByQuery(query, {}, 100) as IGoEnrichment[];
  console.log(results);
  let terms = results.map(enrichment => {
    return `${enrichment.goId} - ${enrichment.description}`;
  });

  terms = [...new Set(terms)];

  console.log(terms);

  return res.json({success: true, payload: terms});
}
