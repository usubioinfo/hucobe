import ExpressionService from '@services/expression.service';
import { Request, Response } from 'express';
import { IExpression } from '@models/expression.model';
import cache from 'memory-cache';

type ExpressionReq = {
  pathogenProteins: string[],
  pathogen: string,
  interactionCategory: string,
  interactionType: string,
  genes: string[]
}

// this needs a request body, so this is a POST request
export const getExpressionsByParamsRoute = async (req: Request, res: Response) => {

  // Shallow clone, there are no complex data types used so this is okay
  const body: ExpressionReq = JSON.parse(JSON.stringify(req.body));
  console.log(body);

  const expressions: IExpression[] = [];

  for (let gene of body.genes) {
    for (let patProtein of body.pathogenProteins) {
      const query = {
        pathogen: body.pathogen,
        pathogenProtein: patProtein,
        interactionCategory: body.interactionCategory,
        interactionType: body.interactionType,
        gene: gene
      }
      const results = await ExpressionService.findModelsByQuery(query);
      if (results) {
        expressions.push(...results);
      }
    }
  }

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
  cache.put('tissueAnnotations', annotations.join(','), 604800000, async () => {
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
