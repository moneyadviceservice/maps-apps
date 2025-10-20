import { GetServerSideProps } from 'next';

import { LeavePotUntouchedResults } from 'components/LeavePotUntouchedResults/LeavePotUntouchedResults';
import { leavePotUntouchedAnalytics } from 'data/analytics';
import { leavePotUntouchedContent, monthInput } from 'data/text';

import { Level } from '@maps-react/common/components/Heading';
import { DocumentScripts } from '@maps-react/core/components/DocumentScripts';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { PensionPotCalculator } from '@maps-react/pension-tools/components/PensionPotCalculator/PensionPotCaclulator';
import {
  monthUpdateInput,
  potInput,
} from '@maps-react/pension-tools/data/pensionToolsFormContent';
import { ErrorObject } from '@maps-react/pension-tools/types';
import { queryStringFormat } from '@maps-react/pension-tools/utils/formatQuery';
import { getErrorRequiredOrInvalid } from '@maps-react/pension-tools/utils/getErrorRequiredOrInvalid';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

type Props = {
  isEmbed: boolean;
  headingLevel?: Level;
  errors: ErrorObject;
  queryData: DataFromQuery;
  nonce?: string;
};

export const LeavePotUntouchedPage = ({
  isEmbed,
  errors,
  headingLevel,
  queryData,
  nonce,
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

  const { z: enTranslation } = useTranslation('en');
  const fields = (t: ReturnType<typeof useTranslation>['z']) => [
    potInput(1, t),
    monthInput(2, t),
    monthUpdateInput(3, t),
  ];

  const children = (
    <PensionPotCalculator
      action="leave-pot-untouched#results"
      isEmbed={isEmbed}
      errors={errors}
      queryData={queryData}
      analyticsData={{
        ...leavePotUntouchedAnalytics,
        pageTitle: page.title,
      }}
      data={leavePotUntouchedContent(z)}
      fields={fields(z)}
      fieldsEn={fields(enTranslation)}
      updateInputs={['updateMonth']}
      results={LeavePotUntouchedResults}
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
      <DocumentScripts
        useGenesysLiveChat={false}
        nonce={nonce}
        useAdobeAnalytics={false}
      />
    </ToolPageLayout>
  );
};

export default LeavePotUntouchedPage;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const isEmbed = !!query?.isEmbedded;

  const getValue = (value: string | string[] | undefined) => {
    return typeof value === 'string'
      ? String(value).replaceAll(',', '')
      : undefined;
  };

  const month = getValue(query['month']);
  const updateMonth = getValue(query['updateMonth']);
  const monthEmpty = month?.length === 0;

  const errors = getErrorRequiredOrInvalid({
    pot: getValue(query['pot']),
    month: monthEmpty ? '0' : month,
  });

  if (errors?.month?.type === 'required') {
    delete errors['month'];
  }

  if (month !== updateMonth) {
    if (getValue(query['submit'])) {
      query['updateMonth'] = query['month'];
    }

    if (getValue(query['reSubmit'])) {
      query['month'] = query['updateMonth'];
    }
  }

  if (month !== updateMonth && getValue(query['submit'])) {
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
      nonce: req?.headers['x-nonce'] || '',
    },
  };
};
