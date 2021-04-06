
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
  6: {virus: 'N/A', interactionCategory: 'common'}
}

export const tissueExpDict: Record<number, string> = {
  1: 'pathogenProtein',
  2: 'isolate',
  3: 'pLength',
  4: 'gene',
  5: 'hLength',
  6: 'interactionType',
  7: 'tissueExpression'
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

export const interactionDict: Record<number, string> = {
  1: 'pathogenProtein',
  2: 'isolate',
  3: 'pLength',
  4: 'gene',
  5: 'hLength',
  6: 'interaction'
}
