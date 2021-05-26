import Excel from 'exceljs';

import { IExpression } from '@models/expression.model';
import ExpressionService from '@services/expression.service';
import { Expression } from '@schemas/expression.schema';

import { tissueExpDict, sheetDict } from '@excel/dictionary';

export const readExcelTissue = async (fileName: string, sheet: number) => {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(fileName);

  let rowIndex = 1;
  const primaryColumn = workbook.worksheets[sheet].getColumn(1);
  const tissueInfo = sheetDict[sheet];

  let maxRowNum = 0;

  primaryColumn.eachCell({includeEmpty: true}, (cell, rowNum) => {
    maxRowNum = rowNum;
  });

  console.log(maxRowNum);

  for (let i = 1; i < maxRowNum + 1; i++) {
    let expression: IExpression;

    if (i === 1) {
      rowIndex += 1;
      continue;
    }

    const currentRow = workbook.worksheets[sheet].getRow(rowIndex);
    const obj: any = {};
    for (let i = 1; i < 8; i++) {
      const key = tissueExpDict[i];

      obj[key] = currentRow.getCell(i).value;
    }

    expression = new Expression(obj);
    if (expression.isolate === 'australia') {
      expression.isolate = 'reference';
    }
    expression.pathogen = tissueInfo.virus;
    expression.interactionCategory = tissueInfo.interactionCategory;
    expression.interactionType = expression.interactionType.toLowerCase();
    expression.pathogen = expression.pathogen.toLowerCase();

    await ExpressionService.saveModel(expression);
    // ExpressionService.saveModel(expression).then(result => console.log(result));

    console.log(expression);

    rowIndex += 1;
  }

}
