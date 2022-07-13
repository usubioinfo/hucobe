import { readExcelInt } from './intparse/parse';
import { readExcelGo } from './goparse/parse';
import { readExcelKegg } from './keggparse/parse';
import { readExcelTissue } from './tissueparse/parse';
import { readExcelLocal } from './localparse/parse';


type TissueExpInfo = {
  virus: string,
  interactionCategory: string
}

export const sheetDict: Record<number, TissueExpInfo> = {
  0: {virus: 'SARS-CoV-2', interactionCategory: 'both'},
  1: {virus: 'SARS-CoV', interactionCategory: 'both'},
  2: {virus: 'MERS', interactionCategory: 'both'},
  3: {virus: 'SARS-CoV-2', interactionCategory: 'unique'},
  4: {virus: 'SARS-CoV', interactionCategory: 'unique'},
  5: {virus: 'MERS', interactionCategory: 'unique'},
  6: {virus: 'common', interactionCategory: 'common'}
}

export const localizationSheetDict: Record<number, string> = {
  0: 'sars-cov-2',
  1: 'sars-cov',
  2: 'mers'
}

export const tissueExpDict: Record<number, string> = {
  1: 'humanProtein',
  2: 'gene',
  3: 'hLength',
  4: 'pathogenProtein',
  5: 'isolate',
  6: 'pLength',
  7: 'interactionType',
  8: 'confidence',
  9: 'hInteractor',
  10: 'pInteractor',
  11: 'publication',
  12: 'tissueExpression'
}

export const goEnrichmentDict: Record<number, string> = {
  1: 'goId',
  2: 'description',
  3: 'geneRatio',
  4: 'bgRatio',
  5: 'pVal',
  6: 'pAdjust',
  7: 'qVal',
  8: 'geneId',
  9: 'count'
}

export const keggEnrichmentDict: Record<number, string> = {
  1: 'keggId',
  2: 'description',
  3: 'geneRatio',
  4: 'bgRatio',
  5: 'pVal',
  6: 'pAdjust',
  7: 'qVal',
  8: 'geneId',
  9: 'count'
}

export const localDict: Record<number, string> = {
  1: 'host',
  2: 'interactions',
  3: 'gene',
  4: 'geneId',
  5: 'location'
}

export const interactionDict: Record<number, string> = {
  1: 'humanProtein',
  2: 'gene',
  3: 'hLength',
  4: 'pathogenProtein',
  5: 'isolate',
  6: 'pLength',
  7: 'interactionType',
  8: 'confidence',
  9: 'hInteractor',
  10: 'pInteractor',
  11: 'publication'
}

export const parseDict: Record<string, (fileName: string, sheet: number) => Promise<void>> = {
  'GO_Enrichment.xlsx': readExcelGo,
  'KEGG_Enrichment.xlsx': readExcelKegg,
  'Final_Interactions.xlsx': readExcelInt,
  'Tissue_Expression_interactions.xlsx': readExcelTissue,
  'Host_Subcellular_localization.xlsx': readExcelLocal
}

export const argDict: Record<string, string> = {
  'go': 'GO_Enrichment.xlsx',
  'kegg': 'KEGG_Enrichment.xlsx',
  'int': 'Final_Interactions.xlsx',
  'tissue': 'Tissue_Expression_interactions.xlsx',
  'local': 'Host_Subcellular_localization.xlsx'
}
