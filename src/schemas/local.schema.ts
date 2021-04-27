import mongoose, { Schema, Model } from 'mongoose';
import { ILocal } from '@models/local.model';

const LocalSchema: Schema = new Schema({
	host: {type: String, required: true},
	interactions: {type: String, required: true},
	gene: {type: String, required: true},
	geneId: {type: String, required: true},
	location: {type: String, required: true},
	pathogen: {type: String, required: true}
},{
	minimize: false
});

export const Local: Model<ILocal> = mongoose.model<ILocal>('Local', LocalSchema);
