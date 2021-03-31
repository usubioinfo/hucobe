import { IGoEnrichment } from '@models/go-enrichment.model';
import { GoEnrichment } from '@schemas/go-enrichment.schema';
import { ModelService } from '@classes/model.service.class';

class GoEnrichmentService extends ModelService<IGoEnrichment> {
	private static instance: GoEnrichmentService;
	
	private constructor() {
		super(GoEnrichment);
	}
	
	public static getInstance(): GoEnrichmentService {
		if (!GoEnrichmentService.instance) {
			GoEnrichmentService.instance = new GoEnrichmentService();
		}
		
		return GoEnrichmentService.instance;
	}
}

const goEnrichmentService = GoEnrichmentService.getInstance();
export default goEnrichmentService;
