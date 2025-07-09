import { useMutation } from '@tanstack/react-query';
import { speechToText,ocrRecognition, textSimilarity } from '@/services/tools-service';

export const useSpeechToText = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const { data } = await speechToText(file);
      return data;
    },
  });
};

export const useOCRRecognition = () => {
  return useMutation({
    mutationFn: async ({ file, isFormatting, isHtml }: { file: File; isFormatting?: number; isHtml?: number }) => {
      const { data } = await ocrRecognition(file, isFormatting, isHtml);
      return data;
    },
  });
};

export const useTextSimilarity = () => {
  return useMutation({
    mutationFn: async ({ sourceFile, targetFile }: { sourceFile: string; targetFile: string }) => {
      const { data } = await textSimilarity(sourceFile, targetFile);
      return data;
    },
  });
};
