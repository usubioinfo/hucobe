import Excel from 'exceljs';
import path from 'path';
import sql from 'sqlite3';
import { open, Database } from 'sqlite';

import { IGoEnrichment } from '@models/go-enrichment.model';
import GoEnrichmentService from '@services/go-enrichment.service';
import { GoEnrichment } from '@schemas/go-enrichment.schema';

import { goEnrichmentDict, sheetDict } from '@excel/dictionary';

const dataPath = path.resolve('hdata');

let bpResults: string[];
let ccResults: string[];
let mfResults: string[];

let db: Database;

export const createSuppData = async () => {
  db = await open({filename: `${dataPath}/hs.sqlite`, driver: sql.Database});
  console.log('data')
  let queryBp = await db.all('SELECT * FROM go_bp_all');
  bpResults = queryBp.map(item => {
    return item.go_id;
  });

  bpResults = [...new Set(bpResults)];

  let queryCc = await db.all('SELECT * FROM go_cc_all');
  ccResults = queryCc.map(item => {
    return item.go_id;
  });

  ccResults = [...new Set(ccResults)];

  let queryMf = await db.all('SELECT * FROM go_mf_all');
  mfResults = queryMf.map(item => {
    return item.go_id;
  });

  mfResults = [...new Set(mfResults)];

  console.log('TEST');
  console.log(mfResults);
}

export const readExcelGo = async (fileName: string, sheet: number) => {
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

  if (!db) {
    db = await open({filename: `${dataPath}/hs.sqlite`, driver: sql.Database});
    console.log('data')
    let queryBp = await db.all('SELECT * FROM go_bp_all');
    bpResults = queryBp.map(item => {
      return item.go_id;
    });

    bpResults = [...new Set(bpResults)];

    let queryCc = await db.all('SELECT * FROM go_cc_all');
    ccResults = queryCc.map(item => {
      return item.go_id;
    });

    ccResults = [...new Set(ccResults)];

    let queryMf = await db.all('SELECT * FROM go_mf_all');
    mfResults = queryMf.map(item => {
      return item.go_id;
    });

    mfResults = [...new Set(mfResults)];

    console.log('TEST');
    console.log(mfResults);
  }

  for (let i = 1; i < maxRowNum + 1; i++) {
    let enrichment: IGoEnrichment;

    if (i === 1) {
      rowIndex += 1;
      continue;
    }

    const currentRow = workbook.worksheets[sheet].getRow(rowIndex);
    const obj: any = {};
    for (let i = 1; i < 10; i++) {
      const key = goEnrichmentDict[i];

      obj[key] = currentRow.getCell(i).value;
    }

    obj['category'] = '';
    obj['genes'] = [];

    enrichment = new GoEnrichment(obj);
    enrichment.pathogen = enrichmentInfo.virus;
    enrichment.pathogen = enrichment.pathogen.toLowerCase();
    enrichment.genes = enrichment.geneId.split('/');
    enrichment.interactionCategory = enrichmentInfo.interactionCategory;

    if (!enrichment.geneRatio.includes('/')) {
      enrichment.geneRatio = '###';
    }

    if (bpResults.includes(enrichment.goId)) {
      enrichment.category = 'biopathway';
    } else if (ccResults.includes(enrichment.goId)) {
      enrichment.category = 'cellcomp';
    } else if (mfResults.includes(enrichment.goId)) {
      enrichment.category = 'molecfunction';
    }

    await GoEnrichmentService.saveModel(enrichment);
    // GoEnrichmentService.saveModel(expression).then(result => console.log(result));

    console.log(enrichment);
    console.log(rowIndex);

    rowIndex += 1;
  }
}
