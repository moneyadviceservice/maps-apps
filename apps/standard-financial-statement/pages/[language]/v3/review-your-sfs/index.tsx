import { GetServerSideProps } from 'next';

import { DownloadStatementButton } from 'components/v3/DownloadStatementButton/DownloadStatementButton';
import { PrintStatementButton } from 'components/v3/PrintStatementButton/PrintStatementButton';
import { StepHeader } from 'components/v3/StepHeader/StepHeader';
import { SummaryTable } from 'components/v3/SummaryTable/SummaryTable';
import { SfsV3Layout } from 'layouts/SfsV3Layout/SfsV3Layout';
import { getUserSession } from 'lib/auth/sessionManagement';
import { SiteSettings } from 'types/@adobe/site-settings';
import { fetchSiteSettings } from 'utils/fetch';

type Props = {
  siteConfig: SiteSettings;
  assetPath: string;
  lang: string;
  isAuthenticated: boolean;
};

const Page = ({ siteConfig, assetPath, lang, isAuthenticated }: Props) => {
  return (
    <SfsV3Layout
      siteConfig={siteConfig}
      assetPath={assetPath}
      isAuthenticated={isAuthenticated}
      lang={lang}
      slug={['/v3/review-your-sfs']}
      breadcrumbs={[
        {
          text: 'SFS V3',
          description: '',
          linkTo: '/v3',
        },
        {
          text: 'Review your Standard Financial Statement',
          description: '',
          linkTo: '/v3/review-your-sfs',
        },
      ]}
    >
      <StepHeader
        progressIndicatorProps={{
          srOnlyText: 'Form step:',
          sectionText: 'Standard Financial Statement',
          stepText: 'Review & Download',
        }}
        mobileText="Review details"
        desktopText="Review your Standard Financial Statement"
      />
      <p className="mb-6 text-sm text-gray-650 underline leading-[normal] lg:mb-8 lg:text-lg lg:no-underline">
        Please review all the information you have entered. You can go back to
        any section to make changes before downloading your statement.
      </p>
      <SummaryTable
        captionText={'Summary table'}
        totalText={'Total Available for Creditors'}
        className="mb-10 lg:mb-12"
        items={[
          {
            type: 'income',
            text: 'Monthly Income Total',
            amount: 1948.81,
            changeLink: { href: '#' },
          },
          {
            type: 'outgoing',
            text: 'Monthly Outgoings (Fixed)',
            amount: 1540.98,
            changeLink: { href: '#' },
          },
          {
            type: 'outgoing',
            text: 'Monthly Outgoings (Flexible)',
            amount: 120.0,
            changeLink: { href: '#' },
          },
          {
            type: 'outgoing',
            text: 'Monthly Savings',
            amount: 100.0,
            changeLink: { href: '#' },
          },
          {
            type: 'outgoing',
            text: 'Debt Administration Fee',
            amount: 34.5,
            changeLink: { href: '#' },
          },
        ]}
      />
      <DownloadStatementButton
        onClick={() => {
          alert('Download statement - placeholder');
        }}
      />
      <PrintStatementButton
        className="mt-4"
        onClick={() => {
          alert('Print statement - placeholder');
        }}
      />
    </SfsV3Layout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const lang = Array.isArray(params?.language)
    ? params.language[0]
    : params?.language ?? 'en';

  const siteConfig = await fetchSiteSettings(lang);
  const session = await getUserSession(context);

  return {
    props: {
      siteConfig: siteConfig ?? {},
      assetPath: process.env.AEM_HOST_PUBLIC ?? '',
      lang: lang,
      isAuthenticated: !!session?.isAuthenticated,
    },
  };
};
