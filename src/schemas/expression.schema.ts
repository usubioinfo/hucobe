import mongoose, { Schema, Model } from 'mongoose';
import { IExpression } from '@models/expression.model';

const ExpressionSchema: Schema = new Schema({
	pathogenProtein: {type: String, required: true},
	isolate: {type: String, required: false},
	pLength: {type: Number, required: false},
	gene: {type: String, required: false},
	hLength: {type: Number, required: false},
	interactionType: {type: String, required: true},
	interactionCategory: {type: String, required: true},
	tissueExpression: {type: String, required: false},
	pathogen: {type: String, required: false}
},{
	minimize: false
});

export const Expression: Model<IExpression> = mongoose.model<IExpression>('Expression', ExpressionSchema);
