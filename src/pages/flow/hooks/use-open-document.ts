import { useCallback } from 'react';

export function useOpenDocument() {
  const openDocument = useCallback(() => {
    window.open(
      //ragflow
      'https://baidu.io/docs/dev/category/agent-components',
      '_blank',
    );
  }, []);

  return openDocument;
}
