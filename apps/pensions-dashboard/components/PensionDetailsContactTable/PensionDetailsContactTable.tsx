import { Fragment } from 'react';

import { Link } from '@maps-react/common/components/Link';
import useTranslation from '@maps-react/hooks/useTranslation';

import { ContactMethods, NO_DATA } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import {
  formatPhoneNumber,
  hasContactMethod,
  hasPreferred,
} from '../../lib/utils';
import { Address } from '../Address';
import { DetailRow } from '../PensionDetailRow';
import { TableSection } from '../TableSection';

const cellClasses =
  'pb-3 md:pt-[14px] md:pb-4 text-left align-top max-md:block';

type PensionDetailsContactTableProps = {
  data: PensionArrangement;
};

export const PensionDetailsContactTable = ({
  data: { pensionAdministrator },
}: PensionDetailsContactTableProps) => {
  const { t } = useTranslation();

  return (
    <TableSection heading={t('pages.pension-details.pension-provider.heading')}>
      <tbody className="max-md:block">
        <DetailRow
          heading={t('pages.pension-details.pension-provider.provider')}
        >
          <td className={cellClasses}>{pensionAdministrator.name}</td>
        </DetailRow>

        <DetailRow heading={t('common.contact.website')}>
          <td className={cellClasses}>
            {hasContactMethod(
              pensionAdministrator.contactMethods,
              ContactMethods.WEB_CONTACTS,
            )
              ? pensionAdministrator.contactMethods.map((method) => {
                  if (
                    ContactMethods.WEB_CONTACTS in method.contactMethodDetails
                  ) {
                    const details = method.contactMethodDetails;
                    return (
                      <div key={details.url}>
                        <Link
                          asInlineText
                          target="_blank"
                          href={details.url}
                          className="break-all"
                        >
                          {details.url}
                        </Link>
                      </div>
                    );
                  }
                })
              : NO_DATA}
          </td>
        </DetailRow>

        <DetailRow
          heading={t('pages.pension-details.pension-provider.preferred')}
        >
          <td className={cellClasses} data-testid="preferred-contact-methods">
            {hasPreferred(pensionAdministrator.contactMethods)
              ? pensionAdministrator.contactMethods
                  .filter((method) => method.preferred)
                  .map((method, idx, arr) => {
                    let content = '';
                    if ('number' in method.contactMethodDetails) {
                      content = t('common.contact.phone');
                    } else if ('email' in method.contactMethodDetails) {
                      content = t('common.contact.email');
                    } else if ('url' in method.contactMethodDetails) {
                      content = t('common.contact.website');
                    } else if ('postalName' in method.contactMethodDetails) {
                      content = t('common.contact.postal-address');
                    }
                    return (
                      <Fragment key={idx}>
                        {content}
                        {idx < arr.length - 1 && ', '}
                      </Fragment>
                    );
                  })
              : NO_DATA}
          </td>
        </DetailRow>

        <DetailRow heading={t('common.contact.email')}>
          <td className={cellClasses} data-testid="contact-method-email">
            {hasContactMethod(
              pensionAdministrator.contactMethods,
              ContactMethods.EMAIL,
            )
              ? pensionAdministrator.contactMethods.map((method) => {
                  if (ContactMethods.EMAIL in method.contactMethodDetails) {
                    const details = method.contactMethodDetails;
                    return (
                      <div key={details.email}>
                        <Link
                          href={`mailto:${details.email}`}
                          className="break-all"
                        >
                          {details.email}
                        </Link>
                      </div>
                    );
                  }
                })
              : NO_DATA}
          </td>
        </DetailRow>

        <DetailRow heading={t('common.contact.telephone')}>
          <td className={cellClasses} data-testid="contact-method-phone">
            {hasContactMethod(
              pensionAdministrator.contactMethods,
              ContactMethods.TELEPHONE,
            )
              ? pensionAdministrator.contactMethods.map((method) => {
                  if (ContactMethods.TELEPHONE in method.contactMethodDetails) {
                    const details = method.contactMethodDetails;
                    return (
                      <div key={details.usage + details.number}>
                        {formatPhoneNumber(details)}
                      </div>
                    );
                  }
                })
              : NO_DATA}
          </td>
        </DetailRow>

        <DetailRow heading={t('common.contact.address')}>
          <td className={cellClasses} data-testid="contact-method-address">
            {hasContactMethod(
              pensionAdministrator.contactMethods,
              ContactMethods.POSTAL_NAME,
            )
              ? pensionAdministrator.contactMethods.map((method) => {
                  if (
                    ContactMethods.POSTAL_NAME in method.contactMethodDetails
                  ) {
                    const address = method.contactMethodDetails;
                    return (
                      <div className="leading-7" key={address.postalName}>
                        <Address address={address} />
                      </div>
                    );
                  }
                })
              : NO_DATA}
          </td>
        </DetailRow>
      </tbody>
    </TableSection>
  );
};
