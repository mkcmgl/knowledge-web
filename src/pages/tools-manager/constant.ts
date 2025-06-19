import { ToolsRouteKey } from '@/constants/tools';

export enum ToolsMenuRouteKey {
  OCR = 'ocr-recognition',
  textSimilarity = 'text-similarity',
  ClusteringAnalysis = 'clustering-analysis',
  SensitiveWord = 'sensitive-word',
  KeywordExtraction = 'keyword-extraction',
  SpeechToText = 'speech-to-text',
}

export const toolsRouteMap = {
  [ToolsMenuRouteKey.OCR]: 'OCR图片识别',
  [ToolsMenuRouteKey.textSimilarity]: '文本相似度计算',
  [ToolsMenuRouteKey.ClusteringAnalysis]: '文本聚类分析',
  [ToolsMenuRouteKey.SensitiveWord]: '敏感词处理',
  [ToolsMenuRouteKey.KeywordExtraction]: '关键词提取',
  [ToolsMenuRouteKey.SpeechToText]: '语言转文字',
};

export const routeMap = {
  [ToolsRouteKey.Dataset]: 'Dataset',
  [ToolsRouteKey.Testing]: 'Retrieval testing',
  [ToolsRouteKey.Configuration]: 'Configuration',
};

export enum KnowledgeDatasetRouteKey {
  Chunk = 'chunk',
  File = 'file',
}

export const datasetRouteMap = {
  [KnowledgeDatasetRouteKey.Chunk]: 'Chunk',
  [KnowledgeDatasetRouteKey.File]: 'File Upload',
};

export *  from '@/constants/tools';

export const TagRenameId = 'tagRename';
