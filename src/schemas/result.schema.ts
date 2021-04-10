import mongoose, { Schema, Model } from 'mongoose';
import { IResult } from '@models/result.model';

const ResultSchema: Schema = new Schema({
	results: [{type: Object, required: true}],
	createdAt: {type: Date, required: true},
	reqTime: {type: Number, required: true}
},{
	minimize: false
});

export const Result: Model<IResult> = mongoose.model<IResult>('Result', ResultSchema);
