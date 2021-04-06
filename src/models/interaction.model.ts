import { Document } from 'mongoose';

export interface IInteraction extends Document {
  pathogenProtein: string,
  pathogen: string,
  isolate: string,
  pLength: string,
  gene: string,
  hLength: string,
  interaction: string
}
