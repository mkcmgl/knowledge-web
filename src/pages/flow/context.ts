import { FlowNodeType } from '@/interfaces/database/flow';
import { createContext } from 'react';

export const FlowFormContext = createContext<FlowNodeType | undefined>(
  undefined,
);
