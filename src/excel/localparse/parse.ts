import Excel from 'exceljs';
import path from 'path';

import { ILocal } from '@models/local.model';
import LocalService from '@services/local.service';
import { Local } from '@schemas/local.schema';

import { localDict, localizationSheetDict } from '@excel/dictionary';

const dataPath = path.resolve('hdata');

let bpResults: string[];
let ccResults: string[];
let mfResults: string[];

export const readExcelLocal = async (fileName: string, sheet: number) => {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(fileName);

  let rowIndex = 1;
  const primaryColumn = workbook.worksheets[sheet].getColumn(1);
  const pathogen = localizationSheetDict[sheet];

  let maxRowNum = 0;

  primaryColumn.eachCell({includeEmpty: true}, (cell, rowNum) => {
    maxRowNum = rowNum;
  });

  console.log(maxRowNum);

  for (let i = 1; i < maxRowNum + 1; i++) {
    let enrichment: ILocal;

    if (i === 1) {
      rowIndex += 1;
      continue;
    }

    const currentRow = workbook.worksheets[sheet].getRow(rowIndex);
    const obj: any = {};
    for (let i = 1; i < 10; i++) {
      const key = localDict[i];

      obj[key] = currentRow.getCell(i).value;
    }

    enrichment = new Local(obj);
    enrichment.pathogen = pathogen;
    enrichment.pathogen = enrichment.pathogen.toLowerCase();

    // await LocalService.saveModel(enrichment);

    console.log(enrichment);
    console.log(rowIndex);

    rowIndex += 1;
  }
}
