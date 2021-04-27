import mongoose, { Schema, Model } from 'mongoose';
import { IGoEnrichment } from '@models/go-enrichment.model';

const GoEnrichmentSchema: Schema = new Schema({
	pathogen: {type: String, required: true},
	goId: {type: String, required: true},
	description: {type: String, required: true},
	geneRatio: {type: String, required: true},
	bgRatio: {type: String, required: true},
	pVal: {type: String, required: true},
	pAdjust: {type: String, required: true},
	qVal: {type: String, required: true},
	gene: {type: String, required: true},
	count: {type: Number, required: true},
	category: {type: String, required: true},
	interactionCategory: {type: String, required: true}
},{
	minimize: false
});

export const GoEnrichment: Model<IGoEnrichment> = mongoose.model<IGoEnrichment>('GoEnrichment', GoEnrichmentSchema);
