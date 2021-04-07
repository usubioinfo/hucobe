import { Document } from 'mongoose';

import { IExpression } from './expression.model';

export interface IExpResult extends Document {
  expressions: IExpression[],
  createdAt: Date,
  reqTime: number // milliseconds
}
