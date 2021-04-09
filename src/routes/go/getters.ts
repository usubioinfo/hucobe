import GoService from '@services/go-enrichment.service';
import { Request, Response } from 'express';
import { IGoEnrichment } from '@models/go-enrichment.model';

export const getGoEnrichmentRoute = async (req: Request, res: Response) => {
  let en = await GoService.findModelsByQuery({}, {}, 19000) as IGoEnrichment[];

  let count = en.length;

  for (let enrichment of en) {
    enrichment.genes = enrichment.geneId.split('/');
    await GoService.saveChangedModel(enrichment, ['genes']);
  }

  return res.json({success: true, count});
}
