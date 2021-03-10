require('tsconfig-paths/register');
import Excel from 'exceljs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { IExpression } from '@models/expression.model';
import ExpressionService from '@services/expression.service';
import { Expression } from '@schema/expression.schema';

dotenv.config();
require('dotenv-defaults/config');

const db = `mongodb://localhost:27017/${process.env.DB_NAME}`;

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connection.on('connected', () => {
  console.log(`Database Connected: ${db}`);
});

mongoose.connection.on('error', (err: any) => {
  console.log('Database Error: ' + err);
});

const dataPath = path.resolve('hdata');

const readExcel = async (fileName: string) => {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(fileName);

  let colIndex = 1;
  let maxCol = workbook.worksheets[0].columns.length;

  let colDict: Record<number, string> = {};
  colDict[1] = 'pathogenProtein';
  colDict[2] = 'isolate';
  colDict[3] = 'pLength';
  colDict[4] = 'gene';
  colDict[5] = 'hLength';
  colDict[6] = 'interaction';
  colDict[7] = 'tissueExpression';

  let rowIndex = 1;
  const primaryColumn = workbook.worksheets[0].getColumn(1);
  primaryColumn.eachCell({ includeEmpty: true }, async (cell, rowNum) => {

    let expression: any = new Expression({
      pathogenProtein: '',
      isolate: '',
      pLength: 0,
      gene: '',
      hLength: 0,
      interaction: '',
      tissueExpression: '',
      pathogen: ''
    });

    if (rowNum === 1) {
      rowIndex += 1;
      return;
    }

    const currentRow = workbook.worksheets[0].getRow(rowIndex);
    const obj: any = {};
    for (let i = 1; i < 8; i++) {
      const key = colDict[i];

      obj[key] = currentRow.getCell(i).value;
    }

    expression = new Expression(obj);
    expression.pathogen = 'SARS-CoV-2';

    await ExpressionService.saveModel(expression);

    console.log(expression);

    rowIndex += 1;
  });
}

readExcel(`${dataPath}/TissueExpressions.xlsx`);
