import mongoose, { Schema, Model } from 'mongoose';
import { IInteraction } from '@models/interaction.model';

const InteractionSchema: Schema = new Schema({
	pathogenProtein: {type: String, required: true},
	pathogen: {type: String, required: true},
	isolate: {type: String, required: true},
	pLength: {type: String, required: true},
	gene: {type: String, required: true},
	hLength: {type: String, required: true},
	interactionType: {type: String, required: true},
	interactionCategory: {type: String, required: true}
},{
	minimize: false
});

export const Interaction: Model<IInteraction> = mongoose.model<IInteraction>('Interaction', InteractionSchema);
