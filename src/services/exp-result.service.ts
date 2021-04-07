import { IExpResult } from '@models/exp-result.model';
import { ExpResult } from '@schemas/exp-result.schema';
import { ModelService } from '@classes/model.service.class';

class ExpResultService extends ModelService<IExpResult> {
	private static instance: ExpResultService;
	
	private constructor() {
		super(ExpResult);
	}
	
	public static getInstance(): ExpResultService {
		if (!ExpResultService.instance) {
			ExpResultService.instance = new ExpResultService();
		}
		
		return ExpResultService.instance;
	}
}

const expResultService = ExpResultService.getInstance();
export default expResultService;
