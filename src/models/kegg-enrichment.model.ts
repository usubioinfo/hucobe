import { Document } from 'mongoose';

export interface IKeggEnrichment extends Document {
  pathogen: string,
  keggId: string;
  description: string,
  geneRatio: string,
  bgRatio: string,
  pVal: string,
  pAdjust: string,
  qVal: string,
  gene: string,
  count: number,
  interactionCategory: string
}
