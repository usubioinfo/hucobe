import express from 'express';
const router = express.Router();
import * as RouteFunctions from './export';

router.post('/new', RouteFunctions.getExpressionsByParamsRoute);
router.get('/test/:test', RouteFunctions.testRoute);
router.get('/annotations', RouteFunctions.getTissueAnnotationsRoute);

export default router;
