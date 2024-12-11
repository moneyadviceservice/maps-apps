import { twMerge } from 'tailwind-merge';

import { Link } from '@maps-react/common/components/Link';
import useTranslation from '@maps-react/hooks/useTranslation';

import { ContactMethods } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import {
  formatDate,
  formatPhoneNumber,
  hasContactMethod,
  hasPreferred,
} from '../../lib/utils';
import { Address } from '../Address';
import { DetailRow } from '../PensionDetailRow';
import { PreferredContacts } from '../PreferredContacts';

const rowClasses = 'border-b-1 border-b-slate-400';
const cellClasses = 'py-3 text-left align-top';

type PensionProviderDetailsTableProps = {
  data: PensionArrangement;
};

export const PensionProviderDetailsTable = ({
  data: { pensionAdministrator, employmentMembershipPeriods },
}: PensionProviderDetailsTableProps) => {
  const { t } = useTranslation();

  return (
    <div className="relative mb-16 overflow-x-auto">
      <table className="w-[800px] md:w-full">
        <tbody>
          <tr className={rowClasses}>
            <td className={twMerge(cellClasses, 'font-bold w-1/2')}>
              {t('pages.pension-details.pension-provider.provider')}
            </td>
            <td className={cellClasses}>{pensionAdministrator.name}</td>
          </tr>

          {employmentMembershipPeriods &&
            employmentMembershipPeriods?.some(
              ({ employerName }) => employerName !== '',
            ) && (
              <DetailRow
                heading={t('pages.pension-details.headings.employer')}
                headingClasses="w-1/2"
              >
                <td className={cellClasses}>
                  {employmentMembershipPeriods?.map(({ employerName }) => {
                    return employerName;
                  })}
                </td>
              </DetailRow>
            )}

          {employmentMembershipPeriods &&
            employmentMembershipPeriods?.some(
              ({ membershipStartDate }) => membershipStartDate !== '',
            ) && (
              <DetailRow
                heading={t('pages.pension-details.headings.employment-dates')}
                headingClasses="w-1/2"
              >
                <td className={cellClasses}>
                  {employmentMembershipPeriods
                    .slice()
                    .sort((a, b) => {
                      return (
                        new Date(a.membershipStartDate).getTime() -
                        new Date(b.membershipStartDate).getTime()
                      );
                    })
                    .map(({ membershipStartDate, membershipEndDate }) => {
                      const key = `${membershipStartDate}-${
                        membershipEndDate || 'current'
                      }`;
                      return (
                        <div key={key}>
                          {!membershipEndDate && 'From '}
                          {formatDate(membershipStartDate)}
                          {membershipEndDate &&
                            ' - ' + formatDate(membershipEndDate)}
                        </div>
                      );
                    })}
                </td>
              </DetailRow>
            )}

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
                  if (ContactMethods.TELEPHONE in method.contactMethodDetails) {
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
                    ContactMethods.WEB_CONTACTS in method.contactMethodDetails
                  ) {
                    const details = method.contactMethodDetails;
                    return (
                      <div key={details.url}>
                        <Link asInlineText target="_blank" href={details.url}>
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
                    ContactMethods.POSTAL_NAME in method.contactMethodDetails
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
  );
};
