import express from 'express';
const router = express.Router();
import * as RouteFunctions from './export';

router.get('/index', RouteFunctions.createGoIndexRoute);
router.post('/new', RouteFunctions.getGoEnrichmentRoute);

export default router;
