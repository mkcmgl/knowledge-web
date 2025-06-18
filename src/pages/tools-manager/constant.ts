import { ToolsRouteKey } from '@/constants/tools';

export enum ToolsMenuRouteKey {
  OCR = 'ocr',
  TextLike = 'textLike',
  TextFenxi = 'textfenxi',
  Mingganci = 'mingganci',
  Guanjianci = 'guanjianci',
  YuyinText = 'yuyintext',
}

export const toolsRouteMap = {
  [ToolsMenuRouteKey.OCR]: 'OCR图片识别',
  [ToolsMenuRouteKey.TextLike]: '文本相似度计算',
  [ToolsMenuRouteKey.TextFenxi]: '文本聚类分析',
  [ToolsMenuRouteKey.Mingganci]: '敏感词处理',
  [ToolsMenuRouteKey.Guanjianci]: '关键词提取',
  [ToolsMenuRouteKey.YuyinText]: '语言转文字',
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
