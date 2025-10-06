import { useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';

import { stepData } from 'data/form-content/analytics/baby-costs-calculator';
import { BabyCostTabIndex, Errors } from 'types';

import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import {
  FormData,
  FormValidationObj,
} from '@maps-react/pension-tools/types/forms';
import { filterQuery } from '@maps-react/pension-tools/utils/filterQuery/filterQuery';
import {
  addObjectKeyPrefix,
  tabQueryTransformer,
} from '@maps-react/pension-tools/utils/TabToolUtils';

import BabyCostCalculatorLanding from './baby-cost-calculator-landing';

type Props = {
  children: JSX.Element;
  isEmbed: boolean;
  step: BabyCostTabIndex | 'save' | 'saved' | 'landing';
  errors?: Errors;
};

type LandingProps = {
  lang: string;
  isEmbed: boolean;
};

export const BabyCostCalculator = ({
  isEmbed,
  step,
  errors,
  children,
}: Readonly<Props>) => {
  const { z } = useTranslation();
  const pageTitle = [
    z({ en: 'Baby Costs Calculator:', cy: 'Cyfrifiannell costau babi:' }),
    stepData[step](z).pageTitle,
    '-',
    z({ en: 'MoneyHelper Tools', cy: 'Teclynnau HelpwrArian' }),
  ].join(' ');

  const title = z({
    en:
      step === 'landing'
        ? 'Work out your baby budget'
        : 'Baby Costs Calculator',
    cy: 'Cyfrifiannell costau babi',
  });

  const ErrorSection = (
    <ErrorSummary
      title="Something went wrong"
      errors={errors}
      classNames="lg:max-w-4xl mt-10"
      containerClassNames="container-auto"
    />
  );

  return isEmbed ? (
    <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      title={title}
      pageTitle={pageTitle}
      showContactUs={false}
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
  currentTab: number;
  formData: FormData;
  validation?: FormValidationObj[];
  lastTab?: string;
};

export const HiddenFields = ({
  isEmbed,
  lang,
  toolBaseUrl,
  currentTab,
  formData,
  validation,
  lastTab,
}: HiddenFieldsProps) => {
  const [hash, setHash] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHash(window.location.hash);
    }
  }, []);

  return (
    <>
      <input type="hidden" name="isEmbed" value={`${isEmbed}`} />
      <input type="hidden" name="language" value={lang} />
      <input type="hidden" name="toolBaseUrl" value={toolBaseUrl} />
      <input type="hidden" name="tab" value={currentTab || ''} />
      <input
        type="hidden"
        name="savedData"
        value={JSON.stringify(addObjectKeyPrefix(formData, 'q-')) || ''}
      />
      <input
        type="hidden"
        name="validation"
        value={JSON.stringify(validation)}
      />
      <input type="hidden" name="lastTab" value={hash && lastTab} />
    </>
  );
};

const Landing = ({ lang, isEmbed }: LandingProps) => (
  <BabyCostCalculator isEmbed={isEmbed} step="landing">
    <BabyCostCalculatorLanding lang={lang} isEmbed={isEmbed} />
  </BabyCostCalculator>
);

export default Landing;

export const getServerSidePropsDefault: GetServerSideProps = async ({
  params,
  query,
}) => {
  const lang = params?.language;
  const isEmbed = !!query?.isEmbedded;
  const currentTab = Number(query?.tab);
  const urlPath = '/';
  const dataPrefix = /^q-.*$/;
  const dataReplace = /^q-/;
  const queryData = tabQueryTransformer(query, dataPrefix, dataReplace);
  const toolBaseUrl = `/${lang}${urlPath}`;
  const backLinkQuery = filterQuery(query, ['language', 'tab']);

  const decodedErrors = query.errors
    ? decodeURIComponent(query.errors as string)
    : null;
  const errors = decodedErrors ? JSON.parse(decodedErrors) : {};

  return {
    props: {
      lang,
      urlPath,
      isEmbed,
      currentTab,
      formData: queryData,
      errors: Object.keys(errors).length > 0 ? errors : null,
      query: query,
      toolBaseUrl: toolBaseUrl,
      backLinkQuery,
    },
  };
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const lang = params?.language ?? 'en';
  return {
    redirect: {
      destination: `/${lang}/1`,
      permanent: false,
    },
  };
};
