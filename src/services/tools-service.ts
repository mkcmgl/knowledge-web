import api from '@/utils/api';
import request from '@/utils/request';

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

