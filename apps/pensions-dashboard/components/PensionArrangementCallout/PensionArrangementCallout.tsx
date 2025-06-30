import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

import { ContactMethods } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import { hasContactMethod, hasPreferred } from '../../lib/utils/contactMethods';
import { formatPhoneNumber } from '../../lib/utils/formatPhoneNumber';
import { Address } from '../Address';
import { PreferredContacts } from '../PreferredContacts';

export const PensionArrangementCallout = ({
  contactReference,
  externalAssetId,
  pensionAdministrator,
  schemeName,
}: PensionArrangement) => {
  const { t } = useTranslation();

  return (
    <InformationCallout
      key={externalAssetId}
      className="px-6 py-8 pb-2 mt-6 md:mt-8"
    >
      <Heading level="h4" color="text-blue-800" className="flex gap-3 mb-4">
        <Icon
          type={IconType.WARNING_SQUARE}
          className="w-[30px] h-[30px] fill-red-700"
        />
        {schemeName}
      </Heading>

      <Paragraph>
        {t('pages.pensions-that-need-action.card.description', {
          pensionAdministrator: pensionAdministrator.name,
        })}
      </Paragraph>
      {contactReference && (
        <>
          <Paragraph className="mb-0 font-bold">
            {t('pages.pensions-that-need-action.card.reference')}
          </Paragraph>
          <Paragraph testId="pension-contact-reference">
            {contactReference}
          </Paragraph>
        </>
      )}

      <div className="py-4 border-t-1">
        <ExpandableSection
          title={t('pages.pensions-that-need-action.card.contact-heading-open')}
          closedTitle={t(
            'pages.pensions-that-need-action.card.contact-heading-close',
          )}
        >
          {hasPreferred(pensionAdministrator.contactMethods) && (
            <div className="mb-4">
              <div className="font-bold">{t('common.contact.preferred')}</div>
              <PreferredContacts
                contactMethods={pensionAdministrator.contactMethods}
              />
            </div>
          )}

          {hasContactMethod(
            pensionAdministrator.contactMethods,
            ContactMethods.TELEPHONE,
          ) && (
            <div
              className="mb-4"
              data-testid={`contact-method-${ContactMethods.TELEPHONE}`}
            >
              <div className="font-bold">{t('common.contact.telephone')}</div>
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
            </div>
          )}

          {hasContactMethod(
            pensionAdministrator.contactMethods,
            ContactMethods.EMAIL,
          ) && (
            <div
              className="mb-4"
              data-testid={`contact-method-${ContactMethods.EMAIL}`}
            >
              <div className="font-bold">{t('common.contact.email')}</div>
              {pensionAdministrator.contactMethods.map((method) => {
                if (ContactMethods.EMAIL in method.contactMethodDetails) {
                  const details = method.contactMethodDetails;
                  return <span key={details.email}>{details.email}</span>;
                }
              })}
            </div>
          )}

          {hasContactMethod(
            pensionAdministrator.contactMethods,
            ContactMethods.WEB_CONTACTS,
          ) && (
            <div
              className="mb-4"
              data-testid={`contact-method-${ContactMethods.WEB_CONTACTS}`}
            >
              <div className="font-bold">Online form</div>
              {pensionAdministrator.contactMethods.map((method) => {
                if (
                  ContactMethods.WEB_CONTACTS in method.contactMethodDetails
                ) {
                  const details = method.contactMethodDetails;
                  return (
                    <div key={details.url}>
                      <Link asInlineText target="_blank" href={details.url}>
                        Contact {pensionAdministrator.name} online
                      </Link>
                    </div>
                  );
                }
              })}
            </div>
          )}

          {hasContactMethod(
            pensionAdministrator.contactMethods,
            ContactMethods.POSTAL_NAME,
          ) && (
            <div
              className="mb-4"
              data-testid={`contact-method-${ContactMethods.POSTAL_NAME}`}
            >
              <div className="font-bold">Address</div>
              {pensionAdministrator.contactMethods.map((method) => {
                if (ContactMethods.POSTAL_NAME in method.contactMethodDetails) {
                  const address = method.contactMethodDetails;
                  return (
                    <div key={address.postalName}>
                      <Address address={address} />
                    </div>
                  );
                }
              })}
            </div>
          )}
        </ExpandableSection>
      </div>
    </InformationCallout>
  );
};
