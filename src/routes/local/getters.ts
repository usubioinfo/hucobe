import dotenv from 'dotenv';

import { Request, Response } from 'express';

import LocalService from '@services/local.service';

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
    gene: { '$in': body.genes }
  };

  if (body.locations) {
    query['location'] = { '$in': body.locations };
  }

  console.log(query);

  const enrichments = await LocalService.findModelsByQuery(query, {}, 19000);

  const intQuery = {
    gene: { '$in': body.genes},
    pathogenProtein: { '$in': body.pathogenProteins },
    pathogen: body.pathogen,
    interactionCategory: body.interactionCategory,
    interactionType: body.interactionType
  }

  let interactions = await InteractionService.findModelsByQuery(intQuery, {}, 19000);

  if (!enrichments || !interactions) {
    return res.status(500).json({success: false, msg: 'Request failed'});
  }

  const oldInt = interactions;

  const sendData: any[] = [];
  for (let enrichment of enrichments) {
    let interaction = interactions.find(int => {
      return int.gene === enrichment.gene;
    });

    interactions = interactions.filter((int): boolean => {
      if (!interaction) {
        return true;
      }
      return int.gene !== interaction.gene || int.pathogenProtein !== interaction.pathogenProtein;
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
        host: enrichment.host,
        location: enrichment.location,
        pathogen: enrichment.pathogen,
        interactions: enrichment.interactions,
        interactionCategory: interaction.interactionCategory,
        confidence: interaction.confidence,
        hInteractor: interaction.hInteractor,
        pInteractor: interaction.pInteractor,
        publication: interaction.publication
      });

      console.log('int');
      console.log(interaction);
    }
  }

  const time1 = performance.now();

  result.reqTime = time1 - time0;
  result.results = sendData;

  await ResultService.saveChangedModel(result, ['reqTime', 'results']);

  console.log(sendData);

  return res.json({success: true, payload: {enrichments, interactions: sendData}});
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
