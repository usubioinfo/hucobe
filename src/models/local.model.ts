import { Document } from 'mongoose';

export interface ILocal extends Document {
  host: string,
  interactions: string,
  gene: string,
  geneId: string,
  location: string
}
