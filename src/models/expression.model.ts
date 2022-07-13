import { Document } from 'mongoose';

export interface IExpression extends Document {
  humanProtein?: string,
  gene?: string,
  hLength?: number,
  pathogenProtein: string,
  isolate?: string,
  pLength?: number,
  interactionType: string,
  interactionCategory: string,
  confidence?:string,
  tissueExpression?: string,
  pathogen?: string,
  hInteractor?: string,
  pInteractor?: string,
  publication?: string,
}
