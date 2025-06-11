import { RedundancyPayCalculatorIndex } from '../../../pages/[language]';
import { analyticsObject } from '../../../utils/AnalyticsObject';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { redundancyPayCalculatorQuestions } from '../questions';
import { ParsedData } from '../../../utils/parseStoredData';
import {
  calculateYearlyPay,
  Salary,
} from '../../../utils/calculateStatutoryRedundancyPay';

export const stepData = {
  1: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'country',
    toolStep: '1',
    pageTitle: redundancyPayCalculatorQuestions(z)[0].title,
    stepName: 'Where in the UK do you live?',
  }),
  2: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'date-of-birth',
    toolStep: '2',
    pageTitle: redundancyPayCalculatorQuestions(z)[1].title,
    stepName: 'What is your date of birth?',
  }),
  3: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'date-of-redundancy',
    toolStep: '3',
    pageTitle: redundancyPayCalculatorQuestions(z)[2].title,
    stepName: 'When will you be made redundant?',
  }),
  4: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'work-start',
    toolStep: '4',
    pageTitle: redundancyPayCalculatorQuestions(z)[3].title,
    stepName: 'When did you start working with your current employer?',
  }),
  5: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'income',
    toolStep: '5',
    pageTitle: redundancyPayCalculatorQuestions(z)[4].title,
    stepName: 'What is your income before tax?',
  }),
  6: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'contractual-redundancy',
    toolStep: '6',
    pageTitle: redundancyPayCalculatorQuestions(z)[5].title,
    stepName: 'Will you be getting contractual redundancy pay?',
  }),
  7: (z: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'contractual-redundancy-amount',
    toolStep: '7',
    pageTitle: redundancyPayCalculatorQuestions(z)[6].title,
    stepName: 'How much contractual redundancy pay will you receive?',
  }),
  changeOptions: (_: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'check-your-answers',
    toolStep: '8',
    pageTitle: 'Check your answers',
    stepName: 'Check your answers',
  }),
  results: (_: ReturnType<typeof useTranslation>['z']) => ({
    pageName: 'results',
    toolStep: '9',
    pageTitle: 'Your results',
    stepName: 'Your results',
  }),
};

export const redundancyPayCalculatorAnalytics = (
  z: ReturnType<typeof useTranslation>['z'],
  currentStep: RedundancyPayCalculatorIndex,
  parsedData: ParsedData,
) => {
  const { pageName, pageTitle, stepName, toolStep } = stepData[currentStep](z);

  const salaryToThousands = (salary: Salary) =>
    Math.round(calculateYearlyPay(salary) / 1000);

  const bYear =
    parsedData.dateOfBirth &&
    (3 === currentStep ||
      'changeOptions' === currentStep ||
      'results' === currentStep)
      ? Number(parsedData.dateOfBirth.split('-')[2])
      : undefined;
  const emolument =
    parsedData.salary &&
    (6 === currentStep ||
      'changeOptions' === currentStep ||
      'results' === currentStep)
      ? salaryToThousands(parsedData.salary)
      : undefined;

  const demo = {
    ...(undefined !== bYear && { bYear }),
    ...(undefined !== emolument && { emolument }),
  };

  const anylticsToolData = {
    tool: 'Redundancy Pay Calculator Tool',
    toolCy: 'Offeryn Cyfrifiannell Tâl Dileu Swydd',
    toolStep: `${toolStep}`,
    stepData: {
      pageName,
      pageTitle,
      stepName,
    },
    pageToolName: 'RPC',
    categoryLevels: ['Work', 'Losing your job', 'Redundancy pay calculator'],
    ...((demo.bYear || demo.emolument) && { demo }),
  };

  return analyticsObject(z, anylticsToolData);
};
