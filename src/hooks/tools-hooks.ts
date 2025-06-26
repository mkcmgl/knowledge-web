import { useMutation } from '@tanstack/react-query';
import { speechToText } from '@/services/tools-service';

export const useSpeechToText = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const { data } = await speechToText(file);
      return data;
    },
  });
};
