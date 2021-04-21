import { ILocal } from '@models/local.model';
import { Local } from '@schemas/local.schema';
import { ModelService } from '@classes/model.service.class';

class LocalService extends ModelService<ILocal> {
	private static instance: LocalService;
	
	private constructor() {
		super(Local);
	}
	
	public static getInstance(): LocalService {
		if (!LocalService.instance) {
			LocalService.instance = new LocalService();
		}
		
		return LocalService.instance;
	}
}

const localService = LocalService.getInstance();
export default localService;
