import { useMemo } from 'react';

import { GetServerSideProps } from 'next';

import { TakeWholePotResults } from 'components/TakeWholePotResults/TakeWholePotResults';

import { Level } from '@maps-react/common/components/Heading';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { PensionPotCalculator } from '@maps-react/pension-tools/components/PensionPotCalculator/PensionPotCaclulator';
import {
  incomeInput,
  potInput,
} from '@maps-react/pension-tools/data/pensionToolsFormContent';
import { ErrorObject } from '@maps-react/pension-tools/types';
import { getErrorRequiredOrInvalid } from '@maps-react/pension-tools/utils/getErrorRequiredOrInvalid';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { takeWholePotAnalytics } from '../../data/analytics';
import { takeWholePotText } from '../../data/takeWholePotText';

type Props = {
  isEmbed: boolean;
  headingLevel?: Level;
  errors: ErrorObject;
  queryData: DataFromQuery;
};

export const TakeWholePot = ({
  isEmbed,
  errors,
  headingLevel,
  queryData,
}: Props) => {
  const { z } = useTranslation();

  const page = {
    title: z({
      en: 'Take your whole pot | Pension Wise',
      cy: 'Cymryd eich cronfa bensiwn cyfan | Pension Wise',
    }),
    description: z({
      en: 'When you reach the age of 55, you may be able to take your entire pension pot as one lump sum. Call  0800 011 3797 for free guidance from one of our pension experts',
      cy: 'Pan gyrhaeddwch 55 oed, efallai y gallwch gymryd eich pot pensiwn cyfan fel un cyfandaliad. Ffoniwch 0800 011 3797 i gael arweiniad am ddim gan un o’n harbenigwyr pensiwn.',
    }),
  };

  const getQuestions = useMemo(() => [incomeInput(1, z), potInput(2, z)], [z]);

  const { z: enTranslation } = useTranslation('en');

  const getQuestionsEn = useMemo(() => {
    return [incomeInput(1, enTranslation), potInput(2, enTranslation)];
  }, [enTranslation]);

  const children = (
    <PensionPotCalculator
      action="take-whole-pot-calculator#results"
      isEmbed={isEmbed}
      errors={errors}
      queryData={queryData}
      analyticsData={{
        ...takeWholePotAnalytics,
        pageTitle: page.title,
      }}
      data={takeWholePotText(z)}
      fields={getQuestions}
      fieldsEn={getQuestionsEn}
      results={TakeWholePotResults}
    />
  );

  return isEmbed ? (
    <EmbedPageLayout>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      className="lg:container-auto pt-4 pb-1.5 lg:max-w-[960px] hidden"
      headingClassName="lg:max-w-[960px]"
      title={page.title}
      showContactUs={true}
      headingLevel={headingLevel ?? 'h1'}
    >
      {children}
    </ToolPageLayout>
  );
};

export default TakeWholePot;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const isEmbed = !!query?.isEmbedded;

  const getValue = (value: string | string[] | undefined) => {
    return typeof value === 'string'
      ? String(value).replaceAll(',', '')
      : undefined;
  };

  const errors = getErrorRequiredOrInvalid({
    income: getValue(query['income']),
    pot: getValue(query['pot']),
  });

  return {
    props: {
      isEmbed: isEmbed,
      errors: errors,
      queryData: query,
    },
  };
};
