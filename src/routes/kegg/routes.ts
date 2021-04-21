import express from 'express';
const router = express.Router();
import * as RouteFunctions from './export';

router.post('/new', RouteFunctions.getKeggEnrichmentRoute);
router.get('/annotations', RouteFunctions.getKeggAnnotationsRoute);

export default router;
