import { GetServerSideProps } from 'next';
import {
  PensionPotCalculator,
  ErrorObject,
} from 'components/PensionPotCalculator/PensionPotCalculator';
import { DataFromQuery } from 'utils/pageFilter';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Level } from '@maps-digital/shared/ui';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { DataPath } from 'types';
import { pensionPotValidateInputs } from 'utils/PensionPotCalculator/pensionPotValidationInputs';
import { takeWholePotAnalytics } from 'data/form-content/analytics';

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

  const children = (
    <PensionPotCalculator
      action="take-whole-pot-calculator#results"
      dataPath={DataPath.TakeWholePot}
      isEmbed={isEmbed}
      errors={errors}
      queryData={queryData}
      analyticsData={{
        ...takeWholePotAnalytics,
        pageTitle: page.title,
      }}
    />
  );

  return isEmbed ? (
    <EmbedPageLayout title={page.title}>{children}</EmbedPageLayout>
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

  const errors = pensionPotValidateInputs({
    inputs: {
      income: getValue(query['income']),
      pot: getValue(query['pot']),
    },
    dataPath: DataPath.TakeWholePot,
  });

  return {
    props: {
      isEmbed: isEmbed,
      errors: errors,
      queryData: query,
    },
  };
};
