import api from '@/utils/api';
import request from '@/utils/request';
import { EventSourceParserStream } from 'eventsource-parser/stream';

export const speechToText = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  // 检查 formData 内容
  for (let [key, value] of formData.entries()) {
    console.log('formData entry:', key, value);
  }
  // 直接用body字段传formData
  return request(api.speechToText, {
    method: 'POST',
    body: formData,
  });
};

export const ocrRecognition = (file: File, isFormatting?: number, isHtml?: number) => {
  const formData = new FormData();
  formData.append('file', file);
  if (typeof isFormatting !== 'undefined') {
    formData.append('isFormatting', String(isFormatting));
  }
  if (typeof isHtml !== 'undefined') {
    formData.append('isHtml', String(isHtml));
  }
  return request(api.ocrRecognition, {
    method: 'POST',
    body: formData,
  });
};

export const textSimilarity = (sourceFile: string, targetFile: string) => {
  return request(api.textSimilarity, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sourceFile, targetFile }),
  });
};

export const textSimilarityStream = async (
  sourceFile: string,
  targetFile: string,
  onMessage: (msg: string, similarity?: number) => void
) => {
  const token = localStorage.getItem('Authorization') || '';
  const response = await fetch('/api/tools/textSimilarity', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
      'authorization': 'Bearer ragflow-' + token,
      'Request-Origion': 'SwaggerBootstrapUi',
    },
    body: JSON.stringify({ sourceFile, targetFile }),
  });
  if (!response.body) throw new Error('No response body');

  // 获取响应头 similarity 字段
  let similarity: number | undefined = undefined;
  const simHeader = response.headers.get('similarity');
  if (simHeader) {
    similarity = parseFloat(simHeader);
  }

  const reader = response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream())
    .getReader();
  while (true) {
    const x = await reader.read();
    if (x) {
      const { done, value } = x;
      if (done) break;
      if (value && value.data) {
        if (value.data === '[DONE]') break;
        onMessage(value.data, similarity);
      }
    }
  }
};

export const sensitiveWord = (textContent: string) => {
  return request(api.sensitiveWord, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ textContent }),
  });
};
export const keywordExtraction = (textContent: string) => {
  return request(api.keywordExtraction, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ textContent }),
  });
};

export const clusteringAnalysis = (clusteringText: string[], thresholdValue: number) => {
  return request(api.clusteringAnalysis, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ clusteringText, thresholdValue }),
  });
};

// 流式聚类分析 SSE
export const clusteringAnalysisStream = async (
  clusteringText: string[],
  thresholdValue: number,
  onMessage: (msg: string) => void
) => {
  const token = localStorage.getItem('Authorization') || '';
  const response = await fetch(api.clusteringAnalysis, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
 
      'authorization': 'Bearer ragflow-' + token,
      'Request-Origion': 'SwaggerBootstrapUi',
    },
    body: JSON.stringify({ clusteringText, thresholdValue }),
  });

  if (!response.body) throw new Error('No response body');

  // 参考聊天 send 方法，使用 TextDecoderStream + EventSourceParserStream
  const reader = response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream())
    .getReader();

  while (true) {
    const x = await reader.read();
    if (x) {
      const { done, value } = x;
      if (done) break;
      if (value && value.data) {
        if (value.data === '[DONE]') break;
        onMessage(value.data);
      }
    }
  }
};

export const clusteringAnalysisCalculate = async (clusteringText: string[], thresholdValue: number) => {
  const token = localStorage.getItem('Authorization') || '';
  const response = await fetch('/api/tools/clusteringAnalysisCalculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'authorization': 'Bearer ragflow-' + token,
      'Request-Origion': 'SwaggerBootstrapUi',
    },
    body: JSON.stringify({ clusteringText, thresholdValue }),
  });
  const res = await response.json();
  if (res.code !== 0) throw new Error(res.message || '聚类分析计算失败');
  return res.data;
};

export const imgUnderstand = (file: File, desQuestion: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('desQuestion', desQuestion);
  return request(api.imgUnderstand, {
    method: 'POST',
    body: formData,
  });
};

export const videoUnderstand = (file: File, desQuestion: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('desQuestion', desQuestion);
  return request(api.videoUnderstand, {
    method: 'POST',
    body: formData,
  });
};


