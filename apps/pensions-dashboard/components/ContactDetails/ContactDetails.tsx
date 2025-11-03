import { ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { Address } from '../../components/Address';
import {
  ContactMethod,
  EmailAddress,
  PensionAdministrator,
  PhoneNumber,
  PostalAddress,
  Website,
} from '../../lib/types';
import { formatPhoneNumber } from '../../lib/utils/ui';

type DefinitionItem = {
  title: string;
  value: ReactNode;
  testId: string;
};

type ContactEntryProps = {
  preferred: boolean;
  children: React.ReactNode;
};

const ContactEntry = ({ preferred, children }: ContactEntryProps) => {
  const { t } = useTranslation();

  return (
    <p className={twMerge(preferred && 'font-bold')}>
      {preferred && `(${t('common.contact.preferred')})`} {children}
    </p>
  );
};

export const ContactDetails = (
  data: PensionAdministrator,
): DefinitionItem[] => {
  const { t } = useTranslation();
  if (!data?.contactMethods) return [];

  const email: ContactMethod[] = [];
  const phone: ContactMethod[] = [];
  const postal: ContactMethod[] = [];
  const web: ContactMethod[] = [];

  for (const method of data.contactMethods) {
    if ('email' in method.contactMethodDetails) email.push(method);
    else if ('number' in method.contactMethodDetails) phone.push(method);
    else if ('postalName' in method.contactMethodDetails) postal.push(method);
    else if ('url' in method.contactMethodDetails) web.push(method);
  }

  const sort = (a: ContactMethod, b: ContactMethod) =>
    Number(b.preferred) - Number(a.preferred);

  const items: DefinitionItem[] = [];

  if (web.length > 0) {
    items.push({
      title: 'Website',
      value: (
        <>
          {web.toSorted(sort).map((contact, i) => {
            const details = contact.contactMethodDetails as Website;
            return (
              <ContactEntry
                key={`contact-web-${i}`}
                preferred={contact.preferred}
              >
                <Link
                  className="break-words"
                  asInlineText
                  target="_blank"
                  href={details.url}
                >
                  {details.url}
                </Link>
              </ContactEntry>
            );
          })}
        </>
      ),
      testId: 'contact-website',
    });
  }

  if (email.length > 0) {
    items.push({
      title: t('common.contact.email-address'),
      value: (
        <>
          {email.toSorted(sort).map((contact, i) => {
            const details = contact.contactMethodDetails as EmailAddress;
            return (
              <ContactEntry
                key={`contact-email-${i}`}
                preferred={contact.preferred}
              >
                {details.email}
              </ContactEntry>
            );
          })}
        </>
      ),
      testId: 'contact-email',
    });
  }

  if (phone.length > 0) {
    items.push({
      title: t('common.contact.telephone'),
      value: (
        <>
          {phone
            .toSorted(sort)
            .slice(0, 10)
            .map((contact, i) => {
              const details = contact.contactMethodDetails as PhoneNumber;
              return (
                <ContactEntry
                  key={`contact-phone-${i}`}
                  preferred={contact.preferred}
                >
                  {formatPhoneNumber(details)}
                </ContactEntry>
              );
            })}
        </>
      ),
      testId: 'contact-telephone',
    });
  }

  if (postal.length > 0) {
    items.push({
      title: t('common.contact.address'),
      value: (
        <>
          {postal.toSorted(sort).map((contact, i) => {
            const details = contact.contactMethodDetails as PostalAddress;
            return (
              <div
                key={`contact-address-${i}`}
                data-testid="address-component"
                className={twMerge(
                  contact.preferred && 'font-bold',
                  'mb-6 last-of-type:mb-0',
                )}
              >
                <Address address={details} preferred={contact.preferred} />
              </div>
            );
          })}
        </>
      ),
      testId: 'contact-postal',
    });
  }

  return items;
};
