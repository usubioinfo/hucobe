import Excel from 'exceljs';

import { IInteraction } from '@models/interaction.model';
import InteractionService from '@services/interaction.service';
import { Interaction } from '@schemas/interaction.schema';

import { interactionDict, sheetDict } from '@excel/dictionary';

export const readExcelInt = async (fileName: string, sheet: number) => {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(fileName);

  let rowIndex = 1;
  const primaryColumn = workbook.worksheets[sheet].getColumn(1);
  const interactionInfo = sheetDict[sheet];

  let maxRowNum = 0;

  primaryColumn.eachCell({includeEmpty: true}, (cell, rowNum) => {
    maxRowNum = rowNum;
  });

  console.log(maxRowNum);

  for (let i = 1; i < maxRowNum + 1; i++) {
    let interaction: IInteraction;

    if (i === 1) {
      rowIndex += 1;
      continue;
    }

    const currentRow = workbook.worksheets[sheet].getRow(rowIndex);
    const obj: any = {};
    const numKeys = 6;
    for (let i = 1; i < numKeys + 1; i++) {
      const key = interactionDict[i];

      obj[key] = currentRow.getCell(i).value;
    }

    obj['pathogen'] = '';

    interaction = new Interaction(obj);
    interaction.pathogen = interactionInfo.virus.toLowerCase();
    interaction.interactionCategory = interactionInfo.interactionCategory;
    if (interaction.interactionType) {
      interaction.interactionType = interaction.interactionType.toLowerCase();
    }

    await InteractionService.saveModel(interaction);

    console.log(interaction);
    console.log(rowIndex);

    rowIndex += 1;
  }
}
