import mongoose, { Schema, Model } from 'mongoose';
import { IKeggEnrichment } from '@models/kegg-enrichment.model';

const KeggEnrichmentSchema: Schema = new Schema({
	pathogen: {type: String, required: true},
	keggId: {type: String, required: true},
	description: {type: String, required: true},
	geneRatio: {type: String, required: true},
	bgRatio: {type: String, required: true},
	pVal: {type: String, required: true},
	pAdjust: {type: String, required: true},
	qVal: {type: String, required: true},
	gene: {type: String, required: true},
	count: {type: Number, required: true},
	interactionCategory: {type: String, required: true}
},{
	minimize: false
});

export const KeggEnrichment: Model<IKeggEnrichment> = mongoose.model<IKeggEnrichment>('KeggEnrichment', KeggEnrichmentSchema);
