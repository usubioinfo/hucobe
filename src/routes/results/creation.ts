import { Request, Response } from 'express';

import ResultService from '@services/result.service';
import { Result } from '@schemas/result.schema';
import { IResult } from '@models/result.model';

// This route basically creates a Result object that is empty and sends it right back to the client
export const getResultIdRoute = async (req: Request, res: Response) => {
  let result = new Result({
    results: [],
    createdAt: new Date(),
    reqTime: 0
  });

  const saved = await ResultService.saveModel(result) as IResult;

  res.json({success: true, payload: saved._id});
}
