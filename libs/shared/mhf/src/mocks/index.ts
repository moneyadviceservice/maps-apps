import { GetServerSidePropsContext } from 'next';

import useTranslation from '@maps-react/hooks/useTranslation';

import { Entry, RouteFlow, RouteFlowValue } from '../types';

export const mockSessionId = 'mock-session-id';
export const mockSteps = ['step-0', 'step-1', 'step-2'];
export const mockFlow = 'mock-flow';
export const mockErrors = {
  'field-1': ['Field 1 is required'],
  'field-2': ['Field 2 is required'],
};
export const mockEntry: Entry = {
  data: { flow: mockFlow, lang: 'en' },
  steps: mockSteps,
  stepIndex: 0,
  errors: {},
};

export const mockRouteFlow: RouteFlow = new Map<string, RouteFlowValue>([
  [mockFlow, { steps: mockSteps }],
]);

export const mockContext = {
  req: {},
  res: {},
} as unknown as GetServerSidePropsContext;

export const mockRadioOptions = [
  {
    value: 'mock-value',
    text: 'mock-text',
  },
];

export const mockRouteConfig = {
  [mockSteps[0]]: {
    sidebar: 'help' as const,
  },
  [mockSteps[1]]: {},
  [mockSteps[2]]: {
    sidebar: 'help' as const,
  },
};

export const mockSections = [
  {
    title: 'mock-title',
    content: 'mock-content',
    items: ['mock-item', 'mock-item'],
    footer: 'mock-footer',
  },
];

export const mockUseTranslation = useTranslation as jest.Mock;
