import mongoose, { Schema, Model } from 'mongoose';
import { IExpResult } from '@models/exp-result.model';

const ExpResultSchema: Schema = new Schema({
	expressions: [{type: Object, required: true}],
	createdAt: {type: Date, required: true},
	reqTime: {type: Number, required: true}
},{
	minimize: false
});

export const ExpResult: Model<IExpResult> = mongoose.model<IExpResult>('ExpResult', ExpResultSchema);
