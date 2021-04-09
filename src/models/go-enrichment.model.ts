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
  geneId: string,
  genes: string[],
  count: number,
  category: string,
  interactionCategory: string
}
