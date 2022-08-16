import { Document } from 'mongoose';

export interface IExpression extends Document {
  humanProtein?: string,
  gene?: string,
  hLength?: number,
  pathogenProtein: string,
  isolate?: string,
  pLength?: number,
  interactionType: string,
  confidence?:string,
  hInteractor?: string,
  pInteractor?: string,
  publication?: string,
  method:string,
  type:string,
  intdb:string,
  interactionCategory: string,
  tissueExpression?: string,
  pathogen?: string,
}
