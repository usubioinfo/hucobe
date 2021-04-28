import express from 'express';
const router = express.Router();
import * as RouteFunctions from './export';

router.get('/annotations', RouteFunctions.getLocalAnnotationsRoute);

export default router;
