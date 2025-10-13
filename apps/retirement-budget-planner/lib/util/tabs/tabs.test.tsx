import { ReactNode } from 'react';

import {
  findNextStep,
  findNextStepName,
  findNextTabId,
  findPreviousStep,
  findTabIndex,
  hasTabExist,
  isEndOfTabs,
  isNextTabToEnable,
} from './tabs';

import '@testing-library/jest-dom';
interface Tab {
  step: number;
  tabName: string;
  title: string;
  content: ReactNode;
}

const mockTabs: Tab[] = [
  {
    step: 1,
    tabName: 'tab1',
    title: 'About me',
    content: <div>About me description</div>,
  },
  {
    step: 2,
    tabName: 'tab2',
    title: 'Income',
    content: <div>Income tab</div>,
  },
  {
    step: 3,
    tabName: 'tab3',
    title: 'Retirement',
    content: <div>Retirement income</div>,
  },
];

describe('test all Tab Utilities functions', () => {
  test('findTabIndex should returns correct index', () => {
    expect(findTabIndex(mockTabs, 'tab2')).toBe(1);
    expect(findTabIndex(mockTabs, 'tab4')).toBe(-1);
  });

  test('hasTabExist should returns true if tab exists', () => {
    expect(hasTabExist(mockTabs, 'tab1')).toBe(true);
    expect(hasTabExist(mockTabs, 'tab4')).toBe(false);
    expect(hasTabExist(mockTabs)).toBe(false);
  });

  test('isNextTabToEnable should return true if index >= enabledTabCount', () => {
    expect(isNextTabToEnable(2, 2)).toBe(true);
    expect(isNextTabToEnable(1, 2)).toBe(false);
    expect(isNextTabToEnable(-1, 2)).toBe(false);
  });

  test('isEndOfTabs should returns true if tab is last', () => {
    expect(isEndOfTabs(mockTabs, 'tab3')).toBe(true);
    expect(isEndOfTabs(mockTabs, 'tab2')).toBe(false);
  });

  test('findNextTabId should returns next tab id', () => {
    expect(findNextTabId(mockTabs, 'tab1')).toBe('tab2');
  });

  test('findNextStepName', () => {
    expect(findNextStepName(mockTabs, 'tab1')).toBe('tab2');
  });

  test('findNextStep should return step number ', () => {
    expect(findNextStep(mockTabs, 'tab1')).toBe(2);
  });

  test('findPreviousStep', () => {
    expect(findPreviousStep(mockTabs, 'tab1')).toBe('landing');
    expect(findPreviousStep(mockTabs, 'tab2')).toBe('tab1');
  });
});
