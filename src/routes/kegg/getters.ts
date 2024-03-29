import dotenv from 'dotenv';

import { Request, Response } from 'express';
import KeggService from '@services/kegg-enrichment.service';

import InteractionService from '@services/interaction.service';

import ResultService from '@services/result.service';
import { IResult } from '@models/result.model';

import cache from 'memory-cache';

import { performance } from 'perf_hooks';
dotenv.config();
require('dotenv-defaults/config');

const CACHE_TIME = parseInt((process.env.ANNOTATION_CACHE_TIME as string));

export const getKeggEnrichmentRoute = async (req: Request, res: Response) => {
  const body = req.body;

  let result = await ResultService.findOneModelByQuery({_id: body.expId}) as IResult;
  const time0 = performance.now();

  const query: any = {
    pathogen: body.pathogen,
    interactionCategory: body.interactionCategory,
    gene: { '$in': body.genes }
  }

  if (body.descriptions) {
    query['description'] = { '$in': body.descriptions };
  }

  console.log(query);

  const enrichments = await KeggService.findModelsByQuery(query, {}, 5000);

  const intQuery: any = {
    gene: { '$in': body.genes},
    pathogenProtein: { '$in': body.pathogenProteins },
    pathogen: body.pathogen,
    interactionCategory: body.interactionCategory,
    interactionType: {'$in': body.interactionType}
  }

  const interactions = await InteractionService.findModelsByQuery(intQuery, {}, 19000);

  const distinct = await KeggService.getDistinct('gene');

  const testQuery = {
    gene: {'$in': distinct},
    interactionCategory: body.interactionCategory
  }

  // const testInt = await InteractionService.findModelsByQuery(testQuery, {}, 19000);
  
  console.log('Test')
  // console.log(testInt);

  if (!enrichments || !interactions) {
    return res.status(500).json({success: false, msg: 'Request failed'});
  }

  const sendData: any[] = [];
  for (let enrichment of enrichments) {
    console.log(enrichment.gene);
    let interaction = interactions.find(int => {
      console.log(int)
      console.log(int.gene);
      console.log(enrichment.gene);
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
        keggId: enrichment.keggId,
        description: enrichment.description,
        fdr: enrichment.pAdjust,
        pathogen: enrichment.pathogen,
        interactionCategory: enrichment.interactionCategory,
        confidence: interaction.confidence,
        hInteractor: interaction.hInteractor,
        pInteractor: interaction.pInteractor,
        publication: interaction.publication,
        method:interaction.method,
        type:interaction.type,
        intdb:interaction.intdb
      });
    }
  }

  const time1 = performance.now();

  result.reqTime = time1 - time0;
  result.results = sendData;

  await ResultService.saveChangedModel(result, ['reqTime', 'results']);
  // console.log(sendData);

  return res.json({success: true, payload: {enrichments, interactions, sendData}});
};

export const getKeggAnnotationsRoute = async (req: Request, res: Response) => {
  const cachedAnnotations = cache.get('keggDesc');

  if (cachedAnnotations) {
    console.log(`Received cached KEGG annotations.`);
    return res.json({success: true, payload: cachedAnnotations.split(',')});
  }

  let annotations = await KeggService.getDistinct('description');

  annotations = annotations.filter((item: string |  null) => {
    if (item) {
      return true;
    }

    return false;
  });

  console.log(`Caching KEGG annotations.`);

  cache.put('keggDesc', annotations.join(','), CACHE_TIME, async () => {
    let annotations = await KeggService.getDistinct('description');

    annotations = annotations.filter((item: string |  null) => {
      if (item) {
        return true;
      }

      return false;
    });
  });

  return res.json({success: true, payload: annotations});
}

export const distinctGeneRoute = async (req: Request, res: Response) => {
  let genes = await InteractionService.getDistinct('gene');

  return res.json({genes});
}
