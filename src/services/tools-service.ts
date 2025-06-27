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
