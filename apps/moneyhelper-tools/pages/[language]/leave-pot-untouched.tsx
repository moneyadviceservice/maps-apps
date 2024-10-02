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
import { queryStringFormat } from 'pages/api/pensions-calculator';
import { leavePotUntouchedAnalytics } from 'data/form-content/analytics/leave-pot-untouched';
type Props = {
  isEmbed: boolean;
  headingLevel?: Level;
  errors: ErrorObject;
  queryData: DataFromQuery;
};

export const LeavePotUntouched = ({
  isEmbed,
  errors,
  headingLevel,
  queryData,
}: Props) => {
  const { z } = useTranslation();

  const page = {
    title: z({
      en: 'Leave your pot untouched | Pension Wise',
      cy: 'Gadael y cyfan o’ch cronfa heb ei gyffwrdd | Pension Wise',
    }),
    description: z({
      en: 'Not ready to retire? Find out more about delaying your pension and what to consider when putting off retirement.',
      cy: 'Ddim yn barod i ymddeol? Darganfyddwch fwy am oedi eich pensiwn a beth i’w hystyried wrth oedi ymddeoliad.',
    }),
  };

  const children = (
    <PensionPotCalculator
      action="leave-pot-untouched#results"
      dataPath={DataPath.LeavePotUntouched}
      isEmbed={isEmbed}
      errors={errors}
      queryData={queryData}
      analyticsData={{
        ...leavePotUntouchedAnalytics,
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

export default LeavePotUntouched;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const isEmbed = !!query?.isEmbedded;

  const getValue = (value: string | string[] | undefined) => {
    return typeof value === 'string'
      ? String(value).replaceAll(',', '')
      : undefined;
  };

  const month = getValue(query['month']);
  const updateMonth = getValue(query['updateMonth']);
  const monthEmpty = month?.length === 0;

  const errors = pensionPotValidateInputs({
    inputs: {
      pot: getValue(query['pot']),
      month: monthEmpty ? '0' : month,
    },
    dataPath: DataPath.LeavePotUntouched,
  });

  if (month !== updateMonth) {
    if (getValue(query['submit'])) {
      query['updateMonth'] = query['month'];
    }

    if (getValue(query['reSubmit'])) {
      query['month'] = query['updateMonth'];
    }
  }

  if (month !== updateMonth) {
    return {
      redirect: {
        destination: `/${
          query.language
        }/leave-pot-untouched?${queryStringFormat(
          query as Record<string, string>,
        )}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      isEmbed: isEmbed,
      errors: errors,
      queryData: query,
    },
  };
};
