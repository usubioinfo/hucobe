import { Document } from 'mongoose';

export interface IExpression extends Document {
  pathogenProtein: string,
  isolate?: string,
  pLength?: number,
  gene?: string,
  hLength?: number,
  interactionType: string,
  interactionCategory: string,
  tissueExpression?: string,
  pathogen?: string
}
