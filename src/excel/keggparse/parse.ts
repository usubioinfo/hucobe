import Excel from 'exceljs';
import path from 'path';
import sql from 'sqlite3';
import { open, Database } from 'sqlite';

const dataPath = path.resolve('hdata');

import { IKeggEnrichment } from '@models/kegg-enrichment.model';
import KeggEnrichmentService from '@services/kegg-enrichment.service';
import { KeggEnrichment } from '@schemas/kegg-enrichment.schema';

import { keggEnrichmentDict, sheetDict } from '@excel/dictionary';

let db: Database;

let IdDict: Record<string, string> = {};

export const translateGenes = async () => {
  db = await open({filename: `${dataPath}/hs.sqlite`, driver: sql.Database});
  let genesInfo = await db.all('SELECT * FROM genes');
  let aliases = await db.all('SELECT * FROM alias');

  let combined: any[] = [];

  genesInfo.forEach((item, index) => {
    const newObj = {
      geneId: item.gene_id,
      geneName: aliases[index].alias_symbol
    };

    combined.push(newObj);
  });

  for (const item of combined) {
    const query = {
      genes: { '$in': [item.geneId] }
    };
    // const foundItem = await KeggEnrichmentService.findModelsByQuery(query);
    IdDict[item.geneId] = item.geneName;
  }
}

export const readExcelKegg = async (fileName: string, sheet: number) => {

  await translateGenes();

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
    let enrichment: IKeggEnrichment;

    if (i === 1) {
      rowIndex += 1;
      continue;
    }

    const currentRow = workbook.worksheets[sheet].getRow(rowIndex);
    const obj: any = {};
    obj['genes'] = [];
    obj['gene'] = '';
    for (let i = 1; i < 10; i++) {
      const key = keggEnrichmentDict[i];

      obj[key] = currentRow.getCell(i).value;
    }
    let genes = [];

    if (obj['geneId']) {
      console.log(obj['geneId']);
      genes = obj['geneId'].split('/');
    }

    for (let gene of genes) {
      enrichment = new KeggEnrichment(obj);
      enrichment.gene = IdDict[gene];
      enrichment.pathogen = enrichmentInfo.virus;
      enrichment.pathogen = enrichment.pathogen.toLowerCase();
      enrichment.interactionCategory = enrichmentInfo.interactionCategory;

      if (!enrichment.geneRatio.includes('/')) {
        enrichment.geneRatio = '###';
      }

      await KeggEnrichmentService.saveModel(enrichment);
      // KeggEnrichmentService.saveModel(expression).then(result => console.log(result));

      console.log(enrichment);
    }

    console.log(rowIndex);

    rowIndex += 1;
  }
}
