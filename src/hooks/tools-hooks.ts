import { useMutation } from '@tanstack/react-query';
import { speechToText, ocrRecognition, textSimilarity, sensitiveWord, keywordExtraction, clusteringAnalysis } from '@/services/tools-service';

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

export const useSensitiveWord = () => {
  return useMutation({
    mutationFn: async (textContent: string) => {
      const { data } = await sensitiveWord(textContent);
      return data;
    },
  });
};
export const useKeywordExtraction = () => {
  return useMutation({
    mutationFn: async (textContent: string) => {
      const { data } = await keywordExtraction(textContent);
      return data;
    },
  });
};

export const useClusteringAnalysis = () => {
  return useMutation({
    mutationFn: async ({ clusteringText, thresholdValue }: { clusteringText: string[]; thresholdValue: number }) => {
      const { data } = await clusteringAnalysis(clusteringText, thresholdValue);
      return data;
    },
  });
};

