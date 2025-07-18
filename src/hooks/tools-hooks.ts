import { useMutation } from '@tanstack/react-query';
import { speechToText, ocrRecognition, textSimilarity, sensitiveWord, keywordExtraction, clusteringAnalysis, imgUnderstand ,videoUnderstand, clusteringAnalysisStream, textSimilarityStream } from '@/services/tools-service';
import { useState } from 'react';

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

export const useImgUnderstand = () => {
  return useMutation({
    mutationFn: async ({ file, desQuestion }: { file: File; desQuestion: string }) => {
      const { data } = await imgUnderstand(file, desQuestion);
      return data;
    },
  });
};

export const useVideoUnderstand = () => {
  return useMutation({
    mutationFn: async ({ file, desQuestion }: { file: File; desQuestion: string }) => {
      const { data } = await videoUnderstand(file, desQuestion);
      return data;
    },
  });
};

// 流式聚类分析 hook
export const useClusteringAnalysisStream = () => {
  const [isLoading, setIsLoading] = useState(false);

  const runClustering = async ({
    clusteringText,
    thresholdValue,
    onMessage,
  }: {
    clusteringText: string[];
    thresholdValue: number;
    onMessage: (msg: string) => void;
  }) => {
    setIsLoading(true);
    try {
      await clusteringAnalysisStream(clusteringText, thresholdValue, onMessage);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      throw e;
    }
  };

  return { runClustering, isLoading };
};

// 流式文本相似度分析 hook
export const useTextSimilarityStream = () => {
  const [isLoading, setIsLoading] = useState(false);

  const runTextSimilarity = async ({
    sourceFile,
    targetFile,
    onMessage,
  }: {
    sourceFile: string;
    targetFile: string;
    onMessage: (msg: string, similarity?: number) => void;
  }) => {
    setIsLoading(true);
    try {
      await textSimilarityStream(sourceFile, targetFile, onMessage);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      throw e;
    }
  };

  return { runTextSimilarity, isLoading };
};

