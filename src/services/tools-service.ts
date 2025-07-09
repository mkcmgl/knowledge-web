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
