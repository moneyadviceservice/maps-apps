import { useTranslation } from '@maps-digital/shared/hooks';
import { QuestionOption } from '@maps-digital/shared/ui';
import { ReactNode } from 'react';
import { pensionDetails } from './pension-details';
import { pensionContributions } from './pension-contributions';
import { pensionResults } from './pension-results';

export enum StepName {
  DETAILS = 'details',
  CONTRIBUTIONS = 'contributions',
  RESULTS = 'results',
}

export type Step = {
  title: string;
  fields?: Fields[];
  stepNumber: number;
  buttonText: string;
};

export type Fields = {
  readonly name: string;
  label?: string;
  information?: string | null;
  options?: QuestionOption[];
  showHide?: ReactNode;
  errors: Record<string, string>;
  defaultValue?: string;
};

export enum PensionInput {
  AGE = 'age',
  SALARY = 'salary',
  FREQUENCY = 'frequency',
  CONTRIBUTION_TYPE = 'contributionType',
  EMPLOYEE_CONTRIBUTION = 'employeeContribution',
  EMPLOYER_CONTRIBUTION = 'employerContribution',
}

export const frequencyOptions = (
  t: ReturnType<typeof useTranslation>['z'],
): { text: string; value: string }[] => {
  return [
    {
      text: t({
        en: 'per year',
        cy: 'y flwyddyn',
      }),
      value: '1',
    },
    {
      text: t({
        en: 'per month',
        cy: 'y mis',
      }),
      value: '12',
    },
    {
      text: t({
        en: 'per 4 weeks',
        cy: 'fesul 4 wythnos',
      }),
      value: '13',
    },
    {
      text: t({
        en: 'per week',
        cy: 'y wythnos',
      }),
      value: '52',
    },
  ];
};

export const stepData = (
  t: ReturnType<typeof useTranslation>['z'],
): Record<string, Step> => {
  return {
    ...pensionDetails(t),
    ...pensionContributions(t),
    ...pensionResults(t),
  };
};

export const pageData = (
  t: ReturnType<typeof useTranslation>['z'],
): Record<string, string> => {
  return {
    title: t({
      en: 'Workplace pension contribution calculator',
      cy: 'Cyfrifiannell cyfraniadau pensiwn gweithle',
    }),
    description: t({
      en: 'It is now law that most employees must be enrolled into a workplace pension scheme by their employer. This calculator will show you how much will be paid into your pension by you and your employer.',
      cy: `Mae’n gyfraith erbyn hyn y dylai’r rhan fwyaf o gyflogeion gael eu cofrestru ar gynllun pensiwn gweithle gan eu cyflogwr. Bydd y gyfrifiannell hon yn dangos faint fydd yn cael ei dalu i mewn i'ch pensiwn gennych chi a'ch cyflogwr.`,
    }),
  };
};
