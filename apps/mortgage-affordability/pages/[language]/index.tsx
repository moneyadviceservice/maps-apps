import { GetServerSideProps } from 'next';
import getConfig from 'next/config';

import { stepData } from 'data/form-content/analytics/mortgage-affordability-calculator';
import { ResultFieldKeys } from 'data/mortgage-affordability/results';
import { MACResultsValidation } from 'data/types';

import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import {
  FormData,
  FormValidationObj,
} from '@maps-react/pension-tools/types/forms';
import {
  addObjectKeyPrefix,
  tabQueryTransformer,
} from '@maps-react/pension-tools/utils/TabToolUtils';

import { MortgageAffordabilityLanding } from './landing';

export type Errors = Record<string, string[]> | null;
export type PageErrors = {
  [key: string]: string[];
};

export type MacSteps = 'landing' | 1 | 2 | 3 | 4 | 'notice';

type Props = {
  children: JSX.Element;
  isEmbed: boolean;
  step: MacSteps;
  pageErrors?: Errors;
  errorKeyPrefix?: string;
};

type PageLandingProps = {
  isEmbed: boolean;
};

export const MortgageAffordability = ({
  isEmbed,
  pageErrors,
  children,
  step,
  errorKeyPrefix,
}: Readonly<Props>) => {
  const { z } = useTranslation();

  const pageTitle = [
    z({
      en: 'Mortgage affordability calculator',
      cy: 'Cyfrifiannell fforddiadwyedd morgais',
    }),
    stepData[step](z).pageTitle,
    '-',
    z({ en: 'MoneyHelper Tools', cy: 'Teclynnau HelpwrArian' }),
  ].join(' ');

  const title = z({
    en: 'Mortgage affordability calculator',
    cy: 'Cyfrifiannell fforddiadwyedd morgais',
  });

  const ErrorSection = pageErrors && (
    <ErrorSummary
      title={z({
        en: 'There is a problem',
        cy: 'Mae yna broblem',
      })}
      errors={pageErrors}
      errorKeyPrefix={errorKeyPrefix}
      classNames="lg:max-w-4xl mt-8"
      containerClassNames="container-auto"
    />
  );

  return isEmbed ? (
    <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      title={title}
      pageTitle={pageTitle}
      titleTag={step === 'landing' ? 'default' : 'span'}
      topInfoSection={ErrorSection}
    >
      {children}
    </ToolPageLayout>
  );
};

type HiddenFieldsProps = {
  isEmbed: boolean;
  lang: string;
  toolBaseUrl: string;
  nextStep: string;
  formData: FormData;
  resultData?: Record<ResultFieldKeys, string>;
  validation?: FormValidationObj[] | MACResultsValidation;
  currentStepIndex?: number;
  currentStep: string;
};

export const HiddenFields = ({
  isEmbed,
  lang,
  toolBaseUrl,
  nextStep,
  formData,
  resultData,
  validation,
  currentStepIndex,
  currentStep,
}: HiddenFieldsProps) => (
  <>
    <input type="hidden" name="isEmbed" value={`${isEmbed}`} />
    <input type="hidden" name="language" value={lang} />
    <input type="hidden" name="toolBaseUrl" value={toolBaseUrl} />
    <input type="hidden" name="nextStep" value={nextStep} />
    <input
      type="hidden"
      name="currentStepIndex"
      value={currentStepIndex ?? 0}
    />
    <input
      type="hidden"
      name="savedData"
      value={JSON.stringify(addObjectKeyPrefix(formData, 'q-')) || ''}
    />
    <input
      type="hidden"
      name="savedResultData"
      value={
        resultData ? JSON.stringify(addObjectKeyPrefix(resultData, 'r-')) : ''
      }
    />
    <input
      type="hidden"
      name="validation"
      value={JSON.stringify(validation) || ''}
    />
    <input type="hidden" name="currentStep" value={currentStep} />
  </>
);

const Landing = ({ isEmbed }: PageLandingProps) => (
  <MortgageAffordability isEmbed={isEmbed} step="landing">
    <MortgageAffordabilityLanding isEmbed={isEmbed} />
  </MortgageAffordability>
);

export default Landing;

export const getServerSidePropsDefault: GetServerSideProps = async ({
  params,
  query,
}) => {
  const lang = params?.language as string;
  const isEmbed = !!query?.isEmbedded;
  const currentStep = query?.step || 'landing';

  const dataPrefix = /^q-.*$/;
  const dataReplace = /^q-/;
  const queryData = tabQueryTransformer(query, dataPrefix, dataReplace);

  const dataResultPrefix = /^r-.*$/;
  const dataResultReplace = /^r-/;
  const resultData = tabQueryTransformer(
    query,
    dataResultPrefix,
    dataResultReplace,
  );

  const decodedErrors = query.errors
    ? decodeURIComponent(query.errors as string)
    : null;
  const errors = decodedErrors ? JSON.parse(decodedErrors) : {};

  return {
    props: {
      lang,
      isEmbed,
      currentStep,
      formData: queryData,
      resultData: resultData,
      errors: Object.keys(errors).length > 0 ? errors : null,
      query: query,
    },
  };
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const lang = context.params?.language as string;
  const {
    publicRuntimeConfig: { ENVIRONMENT },
  } = getConfig();

  if (ENVIRONMENT === 'production') {
    return {
      redirect: {
        destination: `https://www.moneyhelper.org.uk/${lang}/homes/buying-a-home/mortgage-affordability-calculator`,
        permanent: true,
      },
    };
  }

  return getServerSidePropsDefault(context);
};
