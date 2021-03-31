import { IKeggEnrichment } from '@models/kegg-enrichment.model';
import { KeggEnrichment } from '@schemas/kegg-enrichment.schema';
import { ModelService } from '@classes/model.service.class';

class KeggEnrichmentService extends ModelService<IKeggEnrichment> {
	private static instance: KeggEnrichmentService;
	
	private constructor() {
		super(KeggEnrichment);
	}
	
	public static getInstance(): KeggEnrichmentService {
		if (!KeggEnrichmentService.instance) {
			KeggEnrichmentService.instance = new KeggEnrichmentService();
		}
		
		return KeggEnrichmentService.instance;
	}
}

const keggEnrichmentService = KeggEnrichmentService.getInstance();
export default keggEnrichmentService;
