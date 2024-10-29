import { GetServerSideProps, NextPage } from 'next';
import Cookies from 'cookies';
import { Link } from '@maps-react/common/components/Link';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
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
  getRetirementAge,
  getUserSessionFromCookies,
  processBenefitIllustrations,
} from '../../../lib/utils';

type PageProps = {
  data: PensionArrangement[];
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({ data }) => {
  const { t, locale } = useTranslation();
  const title = t('pages.pending-pensions.title');
  const breadcrumb = [
    {
      label: t('pages.overview.title'),
      link: `/${locale}/overview`,
    },
    { label: title, link: `/${locale}/pending-pensions` },
  ];

  return (
    <PensionsDashboardLayout
      title={title}
      breadcrumb={breadcrumb}
      showCommonLinks={true}
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 lg:col-span-2">
          <Markdown content={t('pages.pending-pensions.description')} />
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
            retirementDate,
            benefitIllustrations,
            dateOfBirth,
          }) => {
            const { monthlyAmount, unavailableCode } =
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
                  {pensionType !== PensionType.SP && (
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
                    {/* temporary hardcoding of State Retirement Age because DOB is not available for a SP */}{' '}
                    {pensionType === PensionType.SP
                      ? STATE_RETIREMENT_AGE
                      : getRetirementAge(retirementDate, dateOfBirth)}
                  </Paragraph>
                  <Paragraph className="mb-0 text-gray-400">
                    {t('common.estimated-income')}
                  </Paragraph>
                  <Paragraph className="pb-2 border-b-1 border-slate-400">
                    <strong className="text-xl ">{monthlyAmount}</strong>
                    {monthlyAmount === '£' ? ' unavailable' : ' a month'}
                  </Paragraph>
                  <div className="flex gap-3 mb-6">
                    <Icon
                      className="text-black ml-[-7px] shrink-0 fill-pink-600"
                      fill="true"
                      type={IconType.WARNING}
                    />
                    <Paragraph className="text-gray-400 ">
                      {t(
                        `data.pensions.unavailable-reasons.${unavailableCode}`,
                      )}
                    </Paragraph>
                  </div>
                  <Link
                    asButtonVariant="primary"
                    href={`/${locale}/pension/${externalAssetId}`}
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
    const { incompletePensions } = await getAllPensions(userSession);

    if (!incompletePensions) {
      return { notFound: true };
    }

    return {
      props: {
        data: incompletePensions,
      },
    };
  } catch (error) {
    console.error('Error fetching pending pensions:', error);
    return { notFound: true };
  }
};
