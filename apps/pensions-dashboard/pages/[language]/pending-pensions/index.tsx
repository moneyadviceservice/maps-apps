import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { UnconfirmedPensionsCallout } from '../../../components/UnconfirmedPensionsCallout';
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
  setDashboardChannel,
  storeCurrentUrl,
} from '../../../lib/utils';

type PageProps = {
  data: PensionArrangement[];
  unconfirmedPensions: PensionArrangement[];
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  data,
  unconfirmedPensions,
}) => {
  const { t, locale } = useTranslation();
  const title = t('pages.pending-pensions.title');

  return (
    <PensionsDashboardLayout
      title={title}
      back={`/${locale}/your-pension-search-results`}
      helpAndSupport
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 lg:col-span-2">
          <Markdown content={t('pages.pending-pensions.description')} />
        </div>
      </div>

      <ul
        data-testid="pending-pensions"
        className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3"
      >
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
              processBenefitIllustrations(benefitIllustrations, t);

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
                      className="w-[30px] h-[30px] shrink-0 fill-red-700"
                      fill="true"
                      type={IconType.WARNING_SQUARE}
                    />
                    <Paragraph className="mb-0 text-gray-400">
                      {t(
                        `data.pensions.unavailable-reasons.${unavailableCode}`,
                      )}
                    </Paragraph>
                  </div>
                  <Link
                    asButtonVariant="primary"
                    href={`/${locale}/pension-details/${externalAssetId}`}
                    data-testid="details-link"
                  >
                    {t('common.details-link')}
                  </Link>
                </InformationCallout>
              </li>
            );
          },
        )}
      </ul>
      {unconfirmedPensions && (
        <UnconfirmedPensionsCallout data={unconfirmedPensions} />
      )}
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const userSession = getUserSessionFromCookies(cookies);

  storeCurrentUrl(context);
  setDashboardChannel(context, 'INCOMPLETE');

  try {
    const data = await getAllPensions(userSession);

    // If there are no incomplete pensions, return 404 page
    if (!data?.incompletePensions) {
      return { notFound: true };
    }

    const { incompletePensions, unconfirmedPensions } = data;

    return {
      props: {
        data: incompletePensions,
        unconfirmedPensions,
      },
    };
  } catch (error) {
    console.error('Error fetching pending pensions:', error);
    return { notFound: true };
  }
};
