import ExpressionService from '@services/expression.service';
import { Request, Response } from 'express';
import { IExpression } from '@models/expression.model';

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

      expressions.concat(results as IExpression[]);
    }
  }

  if (expressions.length) {
    return res.status(200).json({success: true, payload: expressions});
  }

  return res.status(500).json({success: false, msg: 'Something went wrong.'});

}

export const testRoute = async (req: Request, res: Response) => {
  return res.send(`${req.params.test}`);
}
