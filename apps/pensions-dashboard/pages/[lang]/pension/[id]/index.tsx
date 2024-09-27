import { GetServerSideProps, NextPage } from 'next';
import Cookies from 'cookies';
import { twMerge } from 'tailwind-merge';
import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { Address } from '../../../../components/Address';
import { PreferredContacts } from '../../../../components/PreferredContacts';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../../layouts/PensionsDashboardLayout';
import {
  ContactMethods,
  IllustrationType,
  PensionType,
} from '../../../../lib/constants';
import { getPensionDetail } from '../../../../lib/fetch';
import {
  BenefitIllustrationComponent,
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
  getMoreInfoMessage,
  getRetirementAge,
  getUserSessionFromCookies,
  hasContactMethod,
  hasPreferred,
} from '../../../../lib/utils';

const rowClasses = 'border-b-1 border-b-slate-400';
const cellClasses = 'py-3 text-left align-top';

type Props = {
  pension: PensionArrangement;
  eri?: BenefitIllustrationComponent;
  hasPayableDetails: boolean;
};

const Page: NextPage<PensionsDashboardLayoutProps & Props> = ({
  title,
  breadcrumb,
  pension,
  eri,
  hasPayableDetails,
}) => {
  const potRow = () => {
    if (pension.benefitIllustrations) {
      let hasPot = false;
      pension.benefitIllustrations?.map((illustration) =>
        illustration.illustrationComponents.map((comp) => {
          if (comp.dcPot) {
            hasPot = true;
          }
        }),
      );
      if (hasPot) {
        return (
          <tr className={rowClasses}>
            <td className={twMerge(cellClasses, 'font-bold')}>Pot value</td>
            {pension.benefitIllustrations.map((illustration) =>
              illustration.illustrationComponents.map((comp, idx) => {
                return (
                  <td className={cellClasses} key={idx}>
                    {comp.dcPot ? currencyAmount(comp.dcPot) : ''}
                  </td>
                );
              }),
            )}
          </tr>
        );
      }
    }
  };

  const employerNameRow = () => {
    if (pension.employmentMembershipPeriods) {
      let hasEmployerName = false;
      pension.employmentMembershipPeriods?.map(
        (employment) =>
          employment.employerName !== '' && (hasEmployerName = true),
      );
      if (hasEmployerName) {
        return (
          <tr className={rowClasses}>
            <td className={twMerge(cellClasses, 'font-bold w-1/2')}>
              Employer
            </td>
            <td className={cellClasses}>
              {pension.employmentMembershipPeriods?.map((employment) => {
                return employment.employerName;
              })}
            </td>
          </tr>
        );
      }
    }
  };

  const employmentDatesRow = () => {
    if (pension.employmentMembershipPeriods) {
      let hasDates = false;
      pension.employmentMembershipPeriods?.map(
        (employment) =>
          employment.membershipStartDate !== '' && (hasDates = true),
      );
      if (hasDates) {
        return (
          <tr className={rowClasses}>
            <td className={twMerge(cellClasses, 'font-bold w-1/2')}>
              Dates of employment
            </td>
            <td className={cellClasses}>
              {pension.employmentMembershipPeriods
                .sort((a, b) => {
                  const dateA = new Date(a.membershipStartDate).getTime();
                  const dateB = new Date(b.membershipStartDate).getTime();
                  return dateA - dateB;
                })
                .map((employment, idx) => {
                  return (
                    <div key={idx}>
                      {!employment.membershipEndDate && 'From '}
                      {formatDate(employment.membershipStartDate)}
                      {employment.membershipEndDate &&
                        ' - ' + formatDate(employment.membershipEndDate)}
                    </div>
                  );
                })}
            </td>
          </tr>
        );
      }
    }
  };

  return (
    <PensionsDashboardLayout
      breadcrumb={breadcrumb}
      title={title}
      showCommonLinks={true}
    >
      <>
        <ToolIntro className="mb-10">
          You can take your {pension.schemeName} on{' '}
          {eri?.payableDetails
            ? formatDate(eri.payableDetails.payableDate)
            : 'date unavailable'}{' '}
          when you are{' '}
          {pension.pensionType === PensionType.SP
            ? '67'
            : getRetirementAge(
                eri?.payableDetails
                  ? eri?.payableDetails.payableDate
                  : pension.retirementDate,
                pension.dateOfBirth,
              )}{' '}
          years old. Your forecast is{' '}
          {eri?.payableDetails ? getMonthlyAmount(eri) : '£unavailable'} a month
          or {eri?.payableDetails ? getAnnualAmount(eri) : '£unavailable'} a
          year.
        </ToolIntro>
        {pension.pensionType === PensionType.SP &&
          pension.statePensionMessageEng && (
            <Paragraph>{pension.statePensionMessageEng}</Paragraph>
          )}
        {pension.additionalDataSources?.map((additionalData, idx) => {
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

        {pension.benefitIllustrations && (
          <>
            <Heading level="h2">Details</Heading>

            <div className="relative mb-16 overflow-x-auto">
              <table className="w-[800px] md:w-full">
                <thead>
                  <tr className={rowClasses}>
                    <th className="md:w-1/2 border-b-1 border-b-slate-400 w-1/4"></th>
                    {pension.benefitIllustrations.map((illustration) =>
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
                      Benefit type
                    </td>
                    {pension.benefitIllustrations.map((illustration) =>
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
                          Annual amount
                        </td>
                        {pension.benefitIllustrations.map((illustration) =>
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
                                      per year
                                    </>
                                  ) : (
                                    '£unavailable'
                                  )}
                                </td>
                              );
                            },
                          ),
                        )}
                      </tr>
                      <tr className={rowClasses}>
                        <td className={twMerge(cellClasses, 'font-bold')}>
                          Monthly amount
                        </td>
                        {pension.benefitIllustrations.map((illustration) =>
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
                                      per month
                                    </>
                                  ) : (
                                    '£unavailable'
                                  )}
                                </td>
                              );
                            },
                          ),
                        )}
                      </tr>
                      <tr className={rowClasses}>
                        <td className={twMerge(cellClasses, 'font-bold')}>
                          Payable date
                        </td>
                        {pension.benefitIllustrations.map((illustration) =>
                          illustration.illustrationComponents.map(
                            (comp, idx) => {
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
                            },
                          ),
                        )}
                      </tr>
                    </>
                  )}
                  {potRow()}
                </tbody>
              </table>
            </div>
          </>
        )}
        <Heading level="h2">Pension provider details</Heading>
        <div className="relative mb-16 overflow-x-auto">
          <table className="w-[800px] md:w-full">
            <tbody>
              <tr className={rowClasses}>
                <td className={twMerge(cellClasses, 'font-bold w-1/2')}>
                  Pension provider
                </td>
                <td className={cellClasses}>
                  {pension.pensionAdministrator.name}
                </td>
              </tr>

              {employerNameRow()}

              {employmentDatesRow()}

              {hasPreferred(pension.pensionAdministrator.contactMethods) && (
                <tr className={rowClasses}>
                  <td className={twMerge(cellClasses, 'font-bold w-1/2')}>
                    Best way to contact your provider with queries
                  </td>
                  <td className={cellClasses}>
                    <PreferredContacts
                      contactMethods={
                        pension.pensionAdministrator.contactMethods
                      }
                    />
                  </td>
                </tr>
              )}

              {hasContactMethod(
                pension.pensionAdministrator.contactMethods,
                ContactMethods.TELEPHONE,
              ) && (
                <tr className={rowClasses}>
                  <td className={twMerge(cellClasses, 'font-bold w-1/2')}>
                    Telephone
                  </td>
                  <td className={cellClasses}>
                    {pension.pensionAdministrator.contactMethods.map(
                      (method) => {
                        if (
                          ContactMethods.TELEPHONE in
                          method.contactMethodDetails
                        ) {
                          const details = method.contactMethodDetails;
                          return (
                            <div key={details.usage + details.number}>
                              {formatPhoneNumber(details)}
                            </div>
                          );
                        }
                      },
                    )}
                  </td>
                </tr>
              )}

              {hasContactMethod(
                pension.pensionAdministrator.contactMethods,
                ContactMethods.EMAIL,
              ) && (
                <tr className={rowClasses}>
                  <td className={twMerge(cellClasses, 'font-bold w-1/2')}>
                    Email
                  </td>
                  <td className={cellClasses}>
                    {pension.pensionAdministrator.contactMethods.map(
                      (method) => {
                        if (
                          ContactMethods.EMAIL in method.contactMethodDetails
                        ) {
                          const details = method.contactMethodDetails;
                          return <div key={details.email}>{details.email}</div>;
                        }
                      },
                    )}
                  </td>
                </tr>
              )}

              {hasContactMethod(
                pension.pensionAdministrator.contactMethods,
                ContactMethods.WEB_CONTACTS,
              ) && (
                <tr className={rowClasses}>
                  <td className={twMerge(cellClasses, 'font-bold w-1/2')}>
                    Website
                  </td>
                  <td className={cellClasses}>
                    {pension.pensionAdministrator.contactMethods.map(
                      (method) => {
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
                      },
                    )}
                  </td>
                </tr>
              )}

              {hasContactMethod(
                pension.pensionAdministrator.contactMethods,
                ContactMethods.POSTAL_NAME,
              ) && (
                <tr className={rowClasses}>
                  <td className={twMerge(cellClasses, 'font-bold w-1/2')}>
                    Address
                  </td>
                  <td className={cellClasses}>
                    {pension.pensionAdministrator.contactMethods.map(
                      (method) => {
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
                      },
                    )}
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

    const title = `${data.schemeName} summary`;

    const eri = getLatestIllustration(IllustrationType.ERI, data);

    const { type } = query;
    const breadcrumbLabel =
      type === 'confirmed' ? 'Your pensions' : 'Pending pensions';
    const breadcrumbLink =
      type === 'confirmed' ? '/en/your-pensions' : '/en/pending-pensions';

    const summaryLinkParams = type ? `?type=${type}` : '';
    const breadcrumb = [
      { label: 'Pensions found', link: '/en/overview' },
      { label: breadcrumbLabel, link: breadcrumbLink },
      {
        label: 'Summary',
        link: `/en/pension/${id}${summaryLinkParams}`,
      },
    ];

    const hasPayableDetails = () => {
      let payableDates = false;
      data.benefitIllustrations?.map((illustration) =>
        illustration.illustrationComponents.map((comp) => {
          if (comp.payableDetails) {
            payableDates = true;
          }
        }),
      );
      return payableDates;
    };

    return {
      props: {
        title,
        breadcrumb,
        pension: data,
        eri,
        hasPayableDetails: hasPayableDetails(),
      },
    };
  } catch (error) {
    console.error('Error fetching pension detail:', error);
    return { notFound: true };
  }
};
