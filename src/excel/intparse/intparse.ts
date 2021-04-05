import Excel from 'exceljs';

import { IGoEnrichment } from '@models/go-enrichment.model';
import GoEnrichmentService from '@services/go-enrichment.service';
import { GoEnrichment } from '@schemas/go-enrichment.schema';

import { interactionDict, sheetDict } from '@excel/dictionary';

export const readExcel = async (fileName: string, sheet: number) => {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(fileName);

  let rowIndex = 1;
  const primaryColumn = workbook.worksheets[sheet].getColumn(1);
  const enrichmentInfo = sheetDict[sheet];

  let maxRowNum = 0;

  primaryColumn.eachCell({includeEmpty: true}, (cell, rowNum) => {
    maxRowNum = rowNum;
  });

  console.log(maxRowNum);

  for (let i = 1; i < maxRowNum + 1; i++) {
    let enrichment: IGoEnrichment;

    if (i === 1) {
      rowIndex += 1;
      continue;
    }

    const currentRow = workbook.worksheets[sheet].getRow(rowIndex);
    const obj: any = {};
    for (let i = 1; i < 10; i++) {
      const key = interactionDict[i];

      obj[key] = currentRow.getCell(i).value;
    }

    enrichment = new GoEnrichment(obj);
    enrichment.pathogen = enrichmentInfo.virus;
    enrichment.pathogen = enrichment.pathogen.toLowerCase();

    await GoEnrichmentService.saveModel(enrichment);
    // GoEnrichmentService.saveModel(expression).then(result => console.log(result));

    console.log(enrichment);
    console.log(rowIndex);

    rowIndex += 1;
  }
}
