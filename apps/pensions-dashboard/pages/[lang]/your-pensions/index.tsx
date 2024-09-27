import { GetServerSideProps, NextPage } from 'next';
import Cookies from 'cookies';
import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { IllustrationType, PensionType } from '../../../lib/constants';
import { getAllPensions } from '../../../lib/fetch';
import { PensionArrangement, RecurringIncomeDetails } from '../../../lib/types';
import {
  currencyAmount,
  getPensionTotals,
  getRetirementAge,
  getUserSessionFromCookies,
  Totals,
} from '../../../lib/utils';

type PageProps = {
  data: PensionArrangement[];
  totals: Totals;
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  data,
  totals,
  title,
  breadcrumb,
}) => {
  return (
    <PensionsDashboardLayout
      title={title}
      breadcrumb={breadcrumb}
      showCommonLinks={true}
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 lg:col-span-2">
          <Heading level="h2" className="mb-4">
            Pension breakdown
          </Heading>
          <Paragraph>
            Your breakdown only includes pensions that have been matched to your
            personal details.
          </Paragraph>
          <Callout variant={CalloutVariant.WHITE} className="mt-10 mb-2">
            <>
              <Heading level="h3" className="mb-4">
                Your summary
              </Heading>
              <Paragraph className="mb-0 text-xl">
                When you are <strong>67</strong> years old, your total estimated
                retirement income could be{' '}
                <strong>{currencyAmount(totals.monthlyTotal)}</strong> a month
                or <strong>{currencyAmount(totals.annualTotal)}</strong> a year.
              </Paragraph>
            </>
          </Callout>
          <ExpandableSection
            variant="mainLeftIcon"
            title="Text description for chart image"
          >
            Charts go here
          </ExpandableSection>
          <Heading level="h2" className="mb-8 mt-12">
            Pensions confirmed as yours
          </Heading>
        </div>
      </div>
      <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
            const monthlyAmount = () => {
              let amount = 0;
              if (benefitIllustrations) {
                for (const benefit of benefitIllustrations) {
                  for (const illustration of benefit.illustrationComponents) {
                    if (
                      illustration.illustrationType === IllustrationType.ERI
                    ) {
                      const payableDetails =
                        illustration.payableDetails as RecurringIncomeDetails;
                      amount = payableDetails.monthlyAmount ?? 0;
                    }
                  }
                }
              }
              return currencyAmount(amount);
            };

            return (
              <li key={externalAssetId} className="col-span-1">
                <InformationCallout className="py-6 px-6">
                  <Heading
                    color="text-blue-800"
                    level="h4"
                    className="flex gap-2 items-top mt-0 mb-4"
                  >
                    {pensionType === PensionType.SP ? schemeName : name}
                  </Heading>
                  {pensionType !== 'SP' && (
                    <>
                      <Paragraph className="mb-0 text-gray-400">
                        Scheme name:
                      </Paragraph>
                      <Paragraph>{schemeName}</Paragraph>
                    </>
                  )}
                  {pensionType === PensionType.SP && (
                    <Paragraph>{name}</Paragraph>
                  )}

                  {employmentMembershipPeriods?.length && (
                    <Paragraph className="mb-0 text-gray-400">
                      Employer:
                    </Paragraph>
                  )}
                  {employmentMembershipPeriods?.length &&
                    employmentMembershipPeriods.map((employer, idx) => (
                      <Paragraph
                        className="border-b-1 border-slate-400 pb-2 mb-2"
                        key={idx}
                      >
                        {employer.employerName}
                      </Paragraph>
                    ))}
                  <Paragraph className="mb-0 text-gray-400">
                    Expected retirement age
                  </Paragraph>
                  <Paragraph className="border-b-1 border-slate-400 pb-2 mb-2">
                    {/* temporary hardcoding of State Retirement Age because DOB is not available for a SP */}
                    {pensionType === PensionType.SP
                      ? '67'
                      : getRetirementAge(retirementDate, dateOfBirth)}
                  </Paragraph>
                  <Paragraph className="mb-0 text-gray-400">
                    Estimated income
                  </Paragraph>
                  <Paragraph className="border-b-1 border-slate-400 pb-2">
                    <strong className="text-xl ">{monthlyAmount()}</strong> a
                    month
                  </Paragraph>
                  <Link
                    asButtonVariant="primary"
                    href={`/en/pension/${externalAssetId}?type=confirmed`}
                  >
                    See details
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
    const title = 'Your pensions';
    const breadcrumb = [
      { label: 'Pensions found', link: '/en/overview' },
      { label: title, link: '/en/your-pensions' },
    ];

    if (!confirmedPensions) {
      return { notFound: true };
    }

    return {
      props: {
        data: confirmedPensions,
        totals,
        title,
        breadcrumb,
      },
    };
  } catch (error) {
    console.error('Error fetching confirmed pensions:', error);
    return { notFound: true };
  }
};
