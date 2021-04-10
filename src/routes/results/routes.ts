import express from 'express';
const router = express.Router();
import * as RouteFunctions from './export';

router.post('/new', RouteFunctions.getResultIdRoute);
router.get('/id/:id', RouteFunctions.getResultRoute);

export default router;
