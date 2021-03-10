import mongoose, { Schema, Model } from 'mongoose';
import { IExpression } from '@models/expression.model';

const ExpressionSchema: Schema = new Schema({
	pathogenProtein: {type: String, required: true},
	isolate: {type: String, required: true},
	pLength: {type: Number, required: true},
	gene: {type: String, required: true},
	hLength: {type: Number, required: true},
	interaction: {type: String, required: true},
	tissueExpression: {type: String, required: true},
	pathogen: {type: String, required: true}
},{
	minimize: false
});

export const Expression: Model<IExpression> = mongoose.model<IExpression>('Expression', ExpressionSchema);
