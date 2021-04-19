import express from 'express';
const router = express.Router();
import * as RouteFunctions from './export';

router.post('/new', RouteFunctions.getGoEnrichmentRoute);
router.get('/annotations', RouteFunctions.getGoAnnotationsRoute);

export default router;
