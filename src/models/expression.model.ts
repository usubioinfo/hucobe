import { Document } from 'mongoose';

export interface IExpression extends Document {
  humanProtein?: string,
  gene?: string,
  hLength?: number,
  pathogenProtein: string,
  isolate?: string,
  pLength?: number,
  interactionType: string,
  hInteractor?: string,
  pInteractor?: string,
  confidence?:string,
  publication?: string,
  interactionCategory: string,
  tissueExpression?: string,
  pathogen?: string,
}
