import { Document } from 'mongoose';

import { IExpression } from './expression.model';
import { IGoEnrichment } from './go-enrichment.model';
import { IKeggEnrichment } from './kegg-enrichment.model';

export interface IResult extends Document {
  results: IExpression[] | IGoEnrichment[] | IKeggEnrichment[],
  createdAt: Date,
  reqTime: number // milliseconds
}
