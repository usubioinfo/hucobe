import { Document } from 'mongoose';

export interface IGoEnrichment extends Document {
  pathogen: string,
  goId: string;
  description: string,
  geneRatio: string,
  bgRatio: string,
  pVal: string,
  pAdjust: string,
  qVal: string,
  gene: string,
  count: number,
  category: string,
  interactionCategory: string
}
