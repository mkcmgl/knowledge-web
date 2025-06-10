import { CodeTemplateStrMap, ProgrammingLanguage } from '@/constants/agent';
import { FlowNodeType } from '@/interfaces/database/flow';
import { isEmpty } from 'lodash';
import { useMemo } from 'react';

export function useValues(node?: FlowNodeType) {
  const defaultValues = useMemo(
    () => ({
      lang: ProgrammingLanguage.Python,
      script: CodeTemplateStrMap[ProgrammingLanguage.Python],
      arguments: [],
    }),
    [],
  );

  const values = useMemo(() => {
    const formData = node?.data?.form;

    if (isEmpty(formData)) {
      return defaultValues;
    }

    return formData;
  }, [defaultValues, node?.data?.form]);

  return values;
}
