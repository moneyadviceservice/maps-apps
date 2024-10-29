import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Paragraph } from '@maps-digital/shared/ui';
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
  options?: any[];
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

export const headingDescription = (
  t: ReturnType<typeof useTranslation>['z'],
) => {
  return t({
    en: (
      <>
        <Paragraph className="mb-5 md:text-[22px] print:hidden text-gray-400">
          This calculator will give you an estimate of how much you and your
          employer will pay into your pension.
        </Paragraph>
        <Paragraph className="mb-5 md:text-[22px] print:hidden text-gray-400">
          To find the exact amount, check your payslip or talk to your employer.
          This tool is for information and guidance only.
        </Paragraph>
      </>
    ),
    cy: (
      <>
        <Paragraph className="mb-5 md:text-[22px] print:hidden text-gray-400">
          Bydd y gyfrifiannell hon yn rhoi amcangyfrif i chi o faint y byddwch
          chi a{"'"}ch cyflogwr yn ei dalu i mewn i{"'"}ch pensiwn.
        </Paragraph>
        <Paragraph className="mb-5 md:text-[22px] print:hidden text-gray-400">
          I ddod o hyd i{"'"}r union swm, gwiriwch eich slip cyflog neu
          siaradwch â{"'"}ch cyflogwr. Er gwybodaeth ac arweiniad yn unig y mae
          {"'"}r teclyn hwn.
        </Paragraph>
      </>
    ),
  });
};
