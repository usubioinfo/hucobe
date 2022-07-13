import { Document } from 'mongoose';

export interface IInteraction extends Document {
  humanProtein: string,
  gene: string,
  hLength: string,
  pathogenProtein: string,
  pathogen: string,
  isolate: string,
  pLength: string,
  interactionType: string,
  interactionCategory: string,
  confidence: string,
  hInteractor: string,
  pInteractor: string,
  publication: string,
}
