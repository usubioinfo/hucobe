import Excel from 'exceljs';
import path from 'path';

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

  type Expression = {
    pathogenProtein: string,
    isolate: string,
    pLength: number,
    gene: string,
    hLength: number,
    interaction: string,
    tissueExpression: string,
    pathogen: string
  }

  let rowIndex = 1;
  const primaryColumn = workbook.worksheets[0].getColumn(1);
  primaryColumn.eachCell({ includeEmpty: true }, (cell, rowNum) => {

    let expression: Expression = {
      pathogenProtein: '',
      isolate: '',
      pLength: 0,
      gene: '',
      hLength: 0,
      interaction: '',
      tissueExpression: '',
      pathogen: ''
    }

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

    expression = obj;
    expression.pathogen = 'SARS-CoV-2';
    console.log(expression);

    rowIndex += 1;
  });
}

readExcel(`${dataPath}/TissueExpressions.xlsx`);
