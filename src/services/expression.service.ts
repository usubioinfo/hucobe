import { IExpression } from '@models/expression.model';
import { Expression } from '@schemas/expression.schema';
import { ModelService } from '@classes/model.service.class';

class ExpressionService extends ModelService<IExpression> {
	private static instance: ExpressionService;
	
	private constructor() {
		super(Expression);
	}
	
	public static getInstance(): ExpressionService {
		if (!ExpressionService.instance) {
			ExpressionService.instance = new ExpressionService();
		}
		
		return ExpressionService.instance;
	}
}

const expressionService = ExpressionService.getInstance();
export default expressionService;
