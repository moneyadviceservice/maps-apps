import { GetServerSideProps, NextPage } from 'next';
import Cookies from 'cookies';
import { Link } from '@maps-react/common/components/Link';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
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
  getRetirementAge,
  getUnavailableText,
  getUserSessionFromCookies,
} from '../../../lib/utils';

type PageProps = {
  data: PensionArrangement[];
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  data,
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
        <div className="lg:col-span-2 col-span-3">
          <Paragraph>
            These pensions are waiting for more information from your pension
            providers. You do not need to take action.
          </Paragraph>
          <Paragraph>
            They&apos;ll automatically show up on your pension breakdown once
            their information is complete.
          </Paragraph>
        </div>
      </div>

      <ul className="lg:grid-cols-2 xl:grid-cols-3 grid grid-cols-1 gap-8">
        {data.map(
          ({
            schemeName,
            employmentMembershipPeriods,
            pensionAdministrator: { name },
            externalAssetId,
            pensionType,
            retirementDate,
            benefitIllustrations,
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
                      amount = payableDetails?.monthlyAmount ?? 0;
                    }
                  }
                }
              }
              return amount === 0 ? '£' : currencyAmount(amount);
            };

            return (
              <li key={externalAssetId} className="col-span-1">
                <InformationCallout className="px-6 py-6">
                  <Heading
                    color="text-blue-800"
                    level="h4"
                    className="items-top flex gap-2 mt-0 mb-4"
                  >
                    {pensionType === PensionType.SP ? schemeName : name}
                  </Heading>
                  {pensionType !== PensionType.SP && (
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
                    {/* temporary hardcoding of State Retirement Age because DOB is not available for a SP */}{' '}
                    {pensionType === PensionType.SP
                      ? '67'
                      : getRetirementAge(retirementDate, dateOfBirth)}
                  </Paragraph>
                  <Paragraph className="mb-0 text-gray-400">
                    Estimated income
                  </Paragraph>
                  <Paragraph className="border-b-1 border-slate-400 pb-2">
                    <strong className=" text-xl">{monthlyAmount()}</strong>
                    {monthlyAmount() === '£' ? ' unavailable' : ' a month'}
                  </Paragraph>

                  <div className="flex gap-3 mb-6">
                    <Icon
                      className="text-black ml-[-7px]"
                      fill="true"
                      type={IconType.WARNING}
                    />
                    <Paragraph className=" text-gray-400">
                      {getUnavailableText(benefitIllustrations)}
                    </Paragraph>
                  </div>
                  <Link
                    asButtonVariant="primary"
                    href={`/en/pension/${externalAssetId}`}
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
    const { incompletePensions } = await getAllPensions(userSession);

    const title = 'Pending Pensions';
    const breadcrumb = [
      { label: 'Pensions found', link: '/en/overview' },
      { label: title, link: '/en/pending-pensions' },
    ];

    if (!incompletePensions) {
      return { notFound: true };
    }

    return {
      props: {
        data: incompletePensions,
        title,
        breadcrumb,
      },
    };
  } catch (error) {
    console.error('Error fetching pending pensions:', error);
    return { notFound: true };
  }
};
