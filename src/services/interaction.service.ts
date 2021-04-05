import { IInteraction } from '@models/interaction.model';
import { Interaction } from '@schemas/interaction.schema';
import { ModelService } from '@classes/model.service.class';

class InteractionService extends ModelService<IInteraction> {
	private static instance: InteractionService;
	
	private constructor() {
		super(Interaction);
	}
	
	public static getInstance(): InteractionService {
		if (!InteractionService.instance) {
			InteractionService.instance = new InteractionService();
		}
		
		return InteractionService.instance;
	}
}

const interactionService = InteractionService.getInstance();
export default interactionService;
