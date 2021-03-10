import { Document } from 'mongoose';

export interface IExpression extends Document {
  pathogenProtein: string,
  isolate: string,
  pLength: number,
  gene: string,
  hLength: number,
  interaction: string,
  tissueExpression: string,
  pathogen: string
}
