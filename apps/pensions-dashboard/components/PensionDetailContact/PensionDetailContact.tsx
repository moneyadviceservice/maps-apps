import React from 'react';

import { twMerge } from 'tailwind-merge';

import { Link } from '@maps-react/common/components/Link';
import useTranslation from '@maps-react/hooks/useTranslation';

import {
  ContactMethod,
  EmailAddress,
  PensionArrangement,
  PhoneNumber,
  PostalAddress,
  Website,
} from '../../lib/types';
import { formatPhoneNumber } from '../../lib/utils';
import { Address } from '../Address';
import { DefinitionList } from '../DefinitionList';

type ContactDetailsProps = {
  preferred: boolean;
  children: React.ReactNode;
};
const ContactDetails = ({ preferred, children }: ContactDetailsProps) => (
  <p className={twMerge(preferred && 'font-bold')}>
    {preferred && '(preferred)'} {children}
  </p>
);

type DetailsContactProps = {
  data: PensionArrangement;
};

export const PensionDetailContact = ({ data }: DetailsContactProps) => {
  const { t } = useTranslation();

  const telephoneContacts: ContactMethod[] = [];
  const emailContacts: ContactMethod[] = [];
  const postalContacts: ContactMethod[] = [];
  const webContacts: ContactMethod[] = [];

  data.pensionAdministrator.contactMethods.forEach((method) => {
    if ('email' in method.contactMethodDetails) {
      emailContacts.push(method);
    } else if ('number' in method.contactMethodDetails) {
      telephoneContacts.push(method);
    } else if ('postalName' in method.contactMethodDetails) {
      postalContacts.push(method);
    } else if ('url' in method.contactMethodDetails) {
      webContacts.push(method);
    }
  });

  const emailContactsSorted = emailContacts.toSorted(
    (a, b) => Number(b.preferred) - Number(a.preferred),
  );

  const telephoneContactsSorted = telephoneContacts.toSorted(
    (a, b) => Number(b.preferred) - Number(a.preferred),
  );

  const postalContactsSorted = postalContacts.toSorted(
    (a, b) => Number(b.preferred) - Number(a.preferred),
  );

  const webContactsSorted = webContacts.toSorted(
    (a, b) => Number(b.preferred) - Number(a.preferred),
  );

  const listData = [
    {
      title: t('common.provider'),
      value: data.pensionAdministrator?.name ?? t('common.no-data'),
      testId: 'provider',
    },
    {
      title: t('pages.pension-details.plan-details.plan-reference'),
      value: data.contactReference ?? t('common.no-data'),
      testId: 'contact-reference',
    },
    ...(webContactsSorted.length > 0
      ? [
          {
            title: 'Website',
            value: (
              <>
                {webContactsSorted.map((contact, i) => {
                  const contactDetails =
                    contact.contactMethodDetails as Website;
                  return (
                    <ContactDetails
                      key={`contact-website-${i}`}
                      preferred={contact.preferred}
                    >
                      <Link
                        asInlineText
                        target="_blank"
                        href={contactDetails.url}
                      >
                        {contactDetails.url}
                      </Link>
                    </ContactDetails>
                  );
                })}
              </>
            ),
            testId: 'contact-website',
          },
        ]
      : []),
    ...(emailContactsSorted.length > 0
      ? [
          {
            title: t('common.contact.email-address'),
            value: (
              <>
                {emailContactsSorted.map((contact, i) => {
                  const contactDetails =
                    contact.contactMethodDetails as EmailAddress;
                  return (
                    <ContactDetails
                      key={`contact-email-${i}`}
                      preferred={contact.preferred}
                    >
                      {contactDetails.email}
                    </ContactDetails>
                  );
                })}
              </>
            ),
            testId: 'contact-email',
          },
        ]
      : []),
    ...(telephoneContactsSorted.length > 0
      ? [
          {
            title: t('common.contact.telephone'),
            value: (
              <>
                {telephoneContactsSorted.slice(0, 10).map((contact, i) => {
                  const contactDetails =
                    contact.contactMethodDetails as PhoneNumber;
                  return (
                    <ContactDetails
                      preferred={contact.preferred}
                      key={`contact-telephone-${i}`}
                    >
                      {formatPhoneNumber(contactDetails)}
                    </ContactDetails>
                  );
                })}
              </>
            ),
            testId: 'contact-telephone',
          },
        ]
      : []),
    ...(postalContactsSorted.length > 0
      ? [
          {
            title: t('common.contact.address'),
            value: (
              <>
                {postalContactsSorted.map((contact) => {
                  const contactDetails =
                    contact.contactMethodDetails as PostalAddress;
                  return (
                    <div
                      key={contactDetails.postalName}
                      className={twMerge(
                        contact.preferred && 'font-bold',
                        'mb-6 last-of-type:mb-0',
                      )}
                    >
                      <Address
                        address={contactDetails}
                        preferred={contact.preferred}
                      />
                    </div>
                  );
                })}
              </>
            ),
            testId: 'contact-postal',
          },
        ]
      : []),
  ];

  return (
    <DefinitionList
      title={t('pages.pension-details.header.contact-provider')}
      subText={t('pages.pension-details.headings.contact-sub')}
      items={listData}
    />
  );
};
