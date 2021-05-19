import { Document } from 'mongoose';

import { IExpression } from './expression.model';
import { IGoEnrichment } from './go-enrichment.model';
import { IKeggEnrichment } from './kegg-enrichment.model';
import { ILocal } from './local.model';
import { IInteraction } from './interaction.model';

export interface IResult extends Document {
  results: IExpression[] | IGoEnrichment[] | IKeggEnrichment[] | ILocal[] | IInteraction[],
  createdAt: Date,
  reqTime: number // milliseconds
}
