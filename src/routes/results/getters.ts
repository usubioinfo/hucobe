import { Request, Response } from 'express';

import ResultService from '@services/result.service';

export const getResultRoute = async (req: Request, res: Response) => {
  const resultId = req.params.id;

  if (!resultId) {
    return res.json({success: false, msg: 'Invalid ID!'});
  }

  const result = await ResultService.findOneModelByQuery({_id: resultId});

  if (result) {
    return res.json({success: true, payload: result});
  }

  return res.json({success: false, msg: 'Result does not exist!'});
}
