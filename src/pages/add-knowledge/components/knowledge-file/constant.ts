import { RunningStatus } from '@/constants/knowledge';

export const RunningStatusMap = {
  [RunningStatus.UNSTART]: {
    label: 'UNSTART',
    color: 'cyan',
  },
  [RunningStatus.RUNNING]: {
    label: 'Parsing',
    color: 'blue',
  },
  [RunningStatus.CANCEL]: { label: 'CANCEL', color: '#999999' },
  [RunningStatus.DONE]: { label: 'SUCCESS', color: '#4CAF50' },
  [RunningStatus.FAIL]: { label: 'FAIL', color: '#F44336' },
};

export * from '@/constants/knowledge';
