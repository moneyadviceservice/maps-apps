import { GetServerSideProps, NextPage } from 'next';
import Cookies from 'cookies';
import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { PensionType, STATE_RETIREMENT_AGE } from '../../../lib/constants';
import { getAllPensions } from '../../../lib/fetch';
import { PensionArrangement } from '../../../lib/types';
import {
  currencyAmount,
  getPensionTotals,
  getRetirementAge,
  getUserSessionFromCookies,
  processBenefitIllustrations,
  Totals,
} from '../../../lib/utils';

type PageProps = {
  data: PensionArrangement[];
  totals: Totals;
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  data,
  totals,
}) => {
  const { t, locale } = useTranslation();
  const title = t('pages.your-pensions.title');
  const breadcrumb = [
    {
      label: t('pages.overview.title'),
      link: `/${locale}/overview`,
    },
    { label: title, link: `/${locale}/your-pensions` },
  ];

  return (
    <PensionsDashboardLayout
      title={title}
      breadcrumb={breadcrumb}
      showCommonLinks={true}
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 lg:col-span-2">
          <Heading level="h2" className="mb-4">
            {t('pages.your-pensions.heading')}
          </Heading>
          <Paragraph>{t('pages.your-pensions.description')}</Paragraph>
          <Callout variant={CalloutVariant.WHITE} className="mt-10 mb-2">
            <>
              <Heading level="h3" className="mb-4">
                {t('pages.your-pensions.callout.heading')}
              </Heading>
              <Markdown
                className="mb-0 text-xl"
                content={t('pages.your-pensions.callout.description', {
                  age: `${STATE_RETIREMENT_AGE}`,
                  monthlyTotal: currencyAmount(totals.monthlyTotal),
                  annualTotal: currencyAmount(totals.annualTotal),
                })}
              />
            </>
          </Callout>
          <ExpandableSection
            variant="mainLeftIcon"
            title="Text description for chart image"
          >
            Charts go here
          </ExpandableSection>
          <Heading level="h2" className="mt-12 mb-8">
            {t('pages.your-pensions.confirmed-pensions.heading')}
          </Heading>
        </div>
      </div>
      <ul className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {data.map(
          ({
            schemeName,
            employmentMembershipPeriods,
            pensionAdministrator: { name },
            externalAssetId,
            pensionType,
            benefitIllustrations,
            retirementDate,
            dateOfBirth,
          }) => {
            const { monthlyAmount } =
              processBenefitIllustrations(benefitIllustrations);

            return (
              <li key={externalAssetId} className="col-span-1">
                <InformationCallout className="px-6 py-6">
                  <Heading
                    color="text-blue-800"
                    level="h4"
                    className="flex gap-2 mt-0 mb-4 items-top"
                  >
                    {pensionType === PensionType.SP ? schemeName : name}
                  </Heading>
                  {pensionType !== 'SP' && (
                    <>
                      <Paragraph className="mb-0 text-gray-400">
                        {t('common.scheme')}:
                      </Paragraph>
                      <Paragraph>{schemeName}</Paragraph>
                    </>
                  )}
                  {pensionType === PensionType.SP && (
                    <Paragraph>{name}</Paragraph>
                  )}

                  {employmentMembershipPeriods?.length && (
                    <Paragraph className="mb-0 text-gray-400">
                      {t('common.employer')}:
                    </Paragraph>
                  )}
                  {employmentMembershipPeriods?.length &&
                    employmentMembershipPeriods.map((employer, idx) => (
                      <Paragraph
                        className="pb-2 mb-2 border-b-1 border-slate-400"
                        key={idx}
                      >
                        {employer.employerName}
                      </Paragraph>
                    ))}
                  <Paragraph className="mb-0 text-gray-400">
                    {t('common.retirement-age')}
                  </Paragraph>
                  <Paragraph className="pb-2 mb-2 border-b-1 border-slate-400">
                    {/* temporary hardcoding of State Retirement Age because DOB is not available for a SP */}
                    {pensionType === PensionType.SP
                      ? STATE_RETIREMENT_AGE
                      : getRetirementAge(retirementDate, dateOfBirth)}
                  </Paragraph>
                  <Paragraph className="mb-0 text-gray-400">
                    {t('common.estimated-income')}
                  </Paragraph>
                  <Paragraph className="pb-2 border-b-1 border-slate-400">
                    <strong className="mr-2 text-xl">{monthlyAmount}</strong>
                    {t('common.per-month')}
                  </Paragraph>
                  <Link
                    asButtonVariant="primary"
                    href={`/${locale}/pension/${externalAssetId}?type=confirmed`}
                  >
                    {t('common.details-link')}
                  </Link>
                </InformationCallout>
              </li>
            );
          },
        )}
      </ul>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookies = new Cookies(req, res);
  const userSession = getUserSessionFromCookies(cookies);

  try {
    const { confirmedPensions } = await getAllPensions(userSession);
    const totals = getPensionTotals(confirmedPensions);

    if (!confirmedPensions) {
      return { notFound: true };
    }

    return {
      props: {
        data: confirmedPensions,
        totals,
      },
    };
  } catch (error) {
    console.error('Error fetching confirmed pensions:', error);
    return { notFound: true };
  }
};
