import { GetServerSideProps, NextPage } from 'next';
import Cookies from 'cookies';
import { twMerge } from 'tailwind-merge';
import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { Markdown } from '@maps-react/vendor/components/Markdown';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Address } from '../../../../components/Address';
import { PreferredContacts } from '../../../../components/PreferredContacts';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../../layouts/PensionsDashboardLayout';
import {
  ContactMethods,
  IllustrationType,
  InformationType,
  PensionType,
  STATE_RETIREMENT_AGE,
} from '../../../../lib/constants';
import { getPensionDetail } from '../../../../lib/fetch';
import {
  AdditionalDataSource,
  BenefitIllustration,
  BenefitIllustrationComponent,
  EmploymentMembershipPeriod,
  PensionArrangement,
  RecurringIncomeDetails,
} from '../../../../lib/types';
import {
  currencyAmount,
  formatDate,
  formatPhoneNumber,
  getAnnualAmount,
  getBenefitType,
  getLatestIllustration,
  getMonthlyAmount,
  getRetirementAge,
  getUserSessionFromCookies,
  hasContactMethod,
  hasPreferred,
} from '../../../../lib/utils';

export const rowClasses = 'border-b-1 border-b-slate-400';
export const cellClasses = 'py-3 text-left align-top';

type Props = {
  id: string;
  type: string;
  data: PensionArrangement;
  eri?: BenefitIllustrationComponent;
  hasPayableDetails: boolean;
};

const Page: NextPage<PensionsDashboardLayoutProps & Props> = ({
  id,
  data: {
    schemeName,
    benefitIllustrations,
    employmentMembershipPeriods,
    pensionType,
    retirementDate,
    dateOfBirth,
    statePensionMessageEng,
    additionalDataSources,
    pensionAdministrator,
  },
  eri,
  hasPayableDetails,
  type,
}) => {
  const { t, locale } = useTranslation();
  const title = t('pages.pension-summary.title', { name: schemeName });
  const crumb = type === 'confirmed' ? 'your-pensions' : 'pending-pensions';
  const queryString = type ? `?type=${type}` : '';
  const breadcrumb = [
    { label: t('pages.overview.title'), link: `/${locale}/overview` },
    {
      label: t(`pages.${crumb}.title`),
      link: `/${locale}/${crumb}`,
    },
    {
      label: t('pages.pension-summary.breadcrumb'),
      link: `/${locale}/pension/${id}${queryString}`,
    },
  ];

  const getMoreInfoMessage = ({ informationType }: AdditionalDataSource) => {
    switch (informationType) {
      case InformationType.C_AND_C:
        return t('pages.pension-summary.more-info.costs');
      case InformationType.SP:
        return t('pages.pension-summary.more-info.sp');
      default:
        return '';
    }
  };

  const potRow = (data: BenefitIllustration[]) =>
    data?.some(({ illustrationComponents: c }) =>
      c.some(({ dcPot }) => dcPot),
    ) ? (
      <tr className={rowClasses}>
        <td className={twMerge(cellClasses, 'font-bold')}>
          {t('pages.pension-summary.headings.pot')}
        </td>
        {data.map(({ illustrationComponents }) =>
          illustrationComponents.map(({ dcPot }, idx) => {
            return (
              <td className={cellClasses} key={idx}>
                {dcPot ? currencyAmount(dcPot) : ''}
              </td>
            );
          }),
        )}
      </tr>
    ) : null;

  const employerNameRow = (
    employmentMembershipPeriods: EmploymentMembershipPeriod[],
  ) =>
    employmentMembershipPeriods?.some(
      ({ employerName }) => employerName !== '',
    ) ? (
      <tr className={rowClasses}>
        <td className={twMerge(cellClasses, 'font-bold w-1/2')}>
          {t('pages.pension-summary.headings.employer')}
        </td>
        <td className={cellClasses}>
          {employmentMembershipPeriods?.map(({ employerName }) => {
            return employerName;
          })}
        </td>
      </tr>
    ) : null;

  const employmentDatesRow = (data: EmploymentMembershipPeriod[]) =>
    data?.some(({ membershipStartDate }) => membershipStartDate !== '') ? (
      <tr className={rowClasses}>
        <td className={twMerge(cellClasses, 'font-bold w-1/2')}>
          {t('pages.pension-summary.headings.employment-dates')}
        </td>
        <td className={cellClasses}>
          {data
            .sort((a, b) => {
              return (
                new Date(a.membershipStartDate).getTime() -
                new Date(b.membershipStartDate).getTime()
              );
            })
            .map(({ membershipStartDate, membershipEndDate }, idx) => {
              return (
                <div key={idx}>
                  {!membershipEndDate && 'From '}
                  {formatDate(membershipStartDate)}
                  {membershipEndDate && ' - ' + formatDate(membershipEndDate)}
                </div>
              );
            })}
        </td>
      </tr>
    ) : null;

  const retirementAge = getRetirementAge(
    eri?.payableDetails ? eri?.payableDetails.payableDate : retirementDate,
    dateOfBirth,
  );

  return (
    <PensionsDashboardLayout
      breadcrumb={breadcrumb}
      title={title}
      showCommonLinks={true}
    >
      <>
        <ToolIntro className="mb-10">
          <Markdown
            content={t('pages.pension-summary.description', {
              name: schemeName,
              date: eri?.payableDetails
                ? formatDate(eri.payableDetails.payableDate)
                : t('common.date-unavailable'),
              age: `${
                pensionType === PensionType.SP
                  ? STATE_RETIREMENT_AGE
                  : retirementAge
              }`,
              monthly: eri?.payableDetails
                ? getMonthlyAmount(eri)
                : t('common.amount-unavailable'),
              yearly: eri?.payableDetails
                ? getAnnualAmount(eri)
                : t('common.amount-unavailable'),
            })}
          />
        </ToolIntro>

        {pensionType === PensionType.SP && statePensionMessageEng && (
          <Paragraph>{statePensionMessageEng}</Paragraph>
        )}

        {additionalDataSources?.map((additionalData, idx) => {
          return (
            <Paragraph key={idx}>
              {getMoreInfoMessage(additionalData)}{' '}
              <Link asInlineText target="_blank" href={additionalData.url}>
                {additionalData.url}
              </Link>
              .
            </Paragraph>
          );
        })}

        {benefitIllustrations && (
          <>
            <Heading level="h2">
              {t('pages.pension-summary.details.heading')}
            </Heading>

            <div className="relative mb-16 overflow-x-auto">
              <table className="w-[800px] md:w-full">
                <thead>
                  <tr className={rowClasses}>
                    <th className="md:w-1/2 border-b-1 border-b-slate-400 w-1/4"></th>
                    {benefitIllustrations.map((illustration) =>
                      illustration.illustrationComponents.map((comp, idx) => (
                        <th className={cellClasses} key={idx}>
                          {comp.illustrationType}
                        </th>
                      )),
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr className={rowClasses}>
                    <td className={twMerge(cellClasses, 'font-bold')}>
                      {t('pages.pension-summary.details.benefit-type')}
                    </td>
                    {benefitIllustrations.map((illustration) =>
                      illustration.illustrationComponents.map((comp, idx) => {
                        return (
                          <td className={cellClasses} key={idx}>
                            {getBenefitType[comp.benefitType]}
                          </td>
                        );
                      }),
                    )}
                  </tr>

                  {hasPayableDetails && (
                    <>
                      <tr className={rowClasses}>
                        <td className={twMerge(cellClasses, 'font-bold')}>
                          {t('pages.pension-summary.details.annual-amount')}
                        </td>
                        {benefitIllustrations.map((illustration) =>
                          illustration.illustrationComponents.map(
                            (comp, idx) => {
                              const payableDetails =
                                comp.payableDetails as RecurringIncomeDetails;
                              return (
                                <td className={cellClasses} key={idx}>
                                  {payableDetails ? (
                                    <>
                                      {currencyAmount(
                                        payableDetails.annualAmount,
                                      )}{' '}
                                      {t('common.per-year')}
                                    </>
                                  ) : (
                                    t('common.amount-unavailable')
                                  )}
                                </td>
                              );
                            },
                          ),
                        )}
                      </tr>

                      <tr className={rowClasses}>
                        <td className={twMerge(cellClasses, 'font-bold')}>
                          {t('pages.pension-summary.details.monthly-amount')}
                        </td>
                        {benefitIllustrations.map((illustration) =>
                          illustration.illustrationComponents.map(
                            (comp, idx) => {
                              const payableDetails =
                                comp.payableDetails as RecurringIncomeDetails;
                              return (
                                <td className={cellClasses} key={idx}>
                                  {payableDetails ? (
                                    <>
                                      {currencyAmount(
                                        payableDetails.monthlyAmount,
                                      )}{' '}
                                      {t('common.per-month')}
                                    </>
                                  ) : (
                                    t('common.amount-unavailable')
                                  )}
                                </td>
                              );
                            },
                          ),
                        )}
                      </tr>

                      <tr className={rowClasses}>
                        <td className={twMerge(cellClasses, 'font-bold')}>
                          {t('pages.pension-summary.details.payable-date')}
                        </td>
                        {benefitIllustrations.map(
                          ({ illustrationComponents }) =>
                            illustrationComponents.map((comp, idx) => {
                              const payableDetails =
                                comp.payableDetails as RecurringIncomeDetails;
                              return (
                                <td className={cellClasses} key={idx}>
                                  {payableDetails ? (
                                    <>
                                      {!payableDetails.lastPaymentDate &&
                                        'From '}
                                      {formatDate(payableDetails.payableDate)}
                                      {payableDetails.lastPaymentDate &&
                                        ' - ' +
                                          formatDate(
                                            payableDetails.lastPaymentDate,
                                          )}
                                    </>
                                  ) : (
                                    'date unavailable'
                                  )}
                                </td>
                              );
                            }),
                        )}
                      </tr>
                    </>
                  )}

                  {benefitIllustrations && potRow(benefitIllustrations)}
                </tbody>
              </table>
            </div>
          </>
        )}

        <Heading level="h2">
          {t('pages.pension-summary.pension-provider.heading')}
        </Heading>

        <div className="relative mb-16 overflow-x-auto">
          <table className="w-[800px] md:w-full">
            <tbody>
              <tr className={rowClasses}>
                <td className={twMerge(cellClasses, 'font-bold w-1/2')}>
                  {t('pages.pension-summary.pension-provider.provider')}
                </td>
                <td className={cellClasses}>{pensionAdministrator.name}</td>
              </tr>

              {employmentMembershipPeriods &&
                employerNameRow(employmentMembershipPeriods)}

              {employmentMembershipPeriods &&
                employmentDatesRow(employmentMembershipPeriods)}

              {hasPreferred(pensionAdministrator.contactMethods) && (
                <tr className={rowClasses}>
                  <td className={twMerge(cellClasses, 'font-bold w-1/2')}>
                    {t('common.contact.preferred')}
                  </td>
                  <td className={cellClasses}>
                    <PreferredContacts
                      contactMethods={pensionAdministrator.contactMethods}
                    />
                  </td>
                </tr>
              )}

              {hasContactMethod(
                pensionAdministrator.contactMethods,
                ContactMethods.TELEPHONE,
              ) && (
                <tr className={rowClasses}>
                  <td className={twMerge(cellClasses, 'font-bold w-1/2')}>
                    {t('common.contact.telephone')}
                  </td>
                  <td className={cellClasses}>
                    {pensionAdministrator.contactMethods.map((method) => {
                      if (
                        ContactMethods.TELEPHONE in method.contactMethodDetails
                      ) {
                        const details = method.contactMethodDetails;
                        return (
                          <div key={details.usage + details.number}>
                            {formatPhoneNumber(details)}
                          </div>
                        );
                      }
                    })}
                  </td>
                </tr>
              )}

              {hasContactMethod(
                pensionAdministrator.contactMethods,
                ContactMethods.EMAIL,
              ) && (
                <tr className={rowClasses}>
                  <td className={twMerge(cellClasses, 'font-bold w-1/2')}>
                    {t('common.contact.email')}
                  </td>
                  <td className={cellClasses}>
                    {pensionAdministrator.contactMethods.map((method) => {
                      if (ContactMethods.EMAIL in method.contactMethodDetails) {
                        const details = method.contactMethodDetails;
                        return <div key={details.email}>{details.email}</div>;
                      }
                    })}
                  </td>
                </tr>
              )}

              {hasContactMethod(
                pensionAdministrator.contactMethods,
                ContactMethods.WEB_CONTACTS,
              ) && (
                <tr className={rowClasses}>
                  <td className={twMerge(cellClasses, 'font-bold w-1/2')}>
                    {t('common.contact.website')}
                  </td>
                  <td className={cellClasses}>
                    {pensionAdministrator.contactMethods.map((method) => {
                      if (
                        ContactMethods.WEB_CONTACTS in
                        method.contactMethodDetails
                      ) {
                        const details = method.contactMethodDetails;
                        return (
                          <div key={details.url}>
                            <Link
                              asInlineText
                              target="_blank"
                              href={details.url}
                            >
                              {details.url}
                            </Link>
                          </div>
                        );
                      }
                    })}
                  </td>
                </tr>
              )}

              {hasContactMethod(
                pensionAdministrator.contactMethods,
                ContactMethods.POSTAL_NAME,
              ) && (
                <tr className={rowClasses}>
                  <td className={twMerge(cellClasses, 'font-bold w-1/2')}>
                    {t('common.contact.address')}
                  </td>
                  <td className={cellClasses}>
                    {pensionAdministrator.contactMethods.map((method) => {
                      if (
                        ContactMethods.POSTAL_NAME in
                        method.contactMethodDetails
                      ) {
                        const address = method.contactMethodDetails;
                        return (
                          <div key={address.postalName}>
                            <Address address={address} />
                          </div>
                        );
                      }
                    })}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
  query,
}) => {
  const cookies = new Cookies(req, res);
  const userSession = getUserSessionFromCookies(cookies);
  const id = (params?.id as string) ?? '';

  try {
    const data = await getPensionDetail(id, userSession);

    if (!data) {
      return { notFound: true };
    }

    const { type } = query;
    const eri = getLatestIllustration(IllustrationType.ERI, data);

    const hasPayableDetails = () =>
      data.benefitIllustrations?.some(({ illustrationComponents }) =>
        illustrationComponents.some(({ payableDetails }) => payableDetails),
      );

    return {
      props: {
        id,
        data,
        eri,
        hasPayableDetails: hasPayableDetails(),
        type: type ?? '',
      },
    };
  } catch (error) {
    console.error('Error fetching pension detail:', error);
    return { notFound: true };
  }
};
