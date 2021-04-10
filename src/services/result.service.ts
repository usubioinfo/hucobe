import { IResult } from '@models/result.model';
import { Result } from '@schemas/result.schema';
import { ModelService } from '@classes/model.service.class';

class ResultService extends ModelService<IResult> {
	private static instance: ResultService;
	
	private constructor() {
		super(Result);
	}
	
	public static getInstance(): ResultService {
		if (!ResultService.instance) {
			ResultService.instance = new ResultService();
		}
		
		return ResultService.instance;
	}
}

const resultService = ResultService.getInstance();
export default resultService;
