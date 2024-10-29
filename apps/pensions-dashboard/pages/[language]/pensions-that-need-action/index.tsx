import { GetServerSideProps, NextPage } from 'next';
import Cookies from 'cookies';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Address } from '../../../components/Address';
import { PreferredContacts } from '../../../components/PreferredContacts';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { getAllPensions } from '../../../lib/fetch';
import { PensionArrangement } from '../../../lib/types';
import {
  formatPhoneNumber,
  getUserSessionFromCookies,
  hasContactMethod,
  hasPreferred,
} from '../../../lib/utils';
import { ContactMethods } from '../../../lib/constants';

type PageProps = {
  data: PensionArrangement[];
};

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({ data }) => {
  const { t, locale } = useTranslation();
  const title = t('pages.pensions-that-need-action.title');
  const breadcrumb = [
    { label: t('pages.overview.title'), link: `/${locale}/overview` },
    { label: title, link: `/${locale}/pensions-that-need-action` },
  ];

  return (
    <PensionsDashboardLayout
      title={title}
      breadcrumb={breadcrumb}
      showCommonLinks={true}
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="lg:col-span-2 col-span-3">
          <Paragraph>
            {t('pages.pensions-that-need-action.description')}
          </Paragraph>
          {data.map(
            (
              {
                schemeName,
                contactReference,
                pensionAdministrator,
                externalAssetId,
              },
              index,
            ) => (
              <InformationCallout
                key={externalAssetId}
                className="px-6 py-8 pb-2 mt-8"
              >
                <Heading level="h4" className="items-top flex gap-2 mb-4">
                  <Icon
                    type={IconType.WARNING}
                    className="scale-[.8] m-[-12px] min-w-16 fill-pink-600"
                  />
                  {schemeName}
                </Heading>
                <Paragraph>
                  {t('pages.pensions-that-need-action.card.description', {
                    pensionAdministrator: pensionAdministrator.name,
                  })}
                </Paragraph>
                <Paragraph className="mb-0 font-bold">
                  {t('pages.pensions-that-need-action.card.reference')}
                </Paragraph>
                <Paragraph>{contactReference}</Paragraph>
                <div className="border-t-1 py-4 mt-8">
                  <ExpandableSection
                    title={t(
                      'pages.pensions-that-need-action.card.contact-heading',
                    )}
                  >
                    {hasPreferred(pensionAdministrator.contactMethods) && (
                      <div className="mb-4">
                        <div className="font-bold">
                          {t('common.contact.preferred')}
                        </div>
                        <PreferredContacts
                          contactMethods={pensionAdministrator.contactMethods}
                        />
                      </div>
                    )}
                    {hasContactMethod(
                      pensionAdministrator.contactMethods,
                      ContactMethods.TELEPHONE,
                    ) && (
                      <div className="mb-4">
                        <div className="font-bold">
                          {t('common.contact.telephone')}
                        </div>
                        {pensionAdministrator.contactMethods.map((method) => {
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
                        })}
                      </div>
                    )}
                    {hasContactMethod(
                      pensionAdministrator.contactMethods,
                      ContactMethods.EMAIL,
                    ) && (
                      <div className="mb-4">
                        <div className="font-bold">
                          {t('common.contact.email')}
                        </div>
                        {pensionAdministrator.contactMethods.map((method) => {
                          if (
                            ContactMethods.EMAIL in method.contactMethodDetails
                          ) {
                            const details = method.contactMethodDetails;
                            return (
                              <span key={details.email}>{details.email}</span>
                            );
                          }
                        })}
                      </div>
                    )}
                    {hasContactMethod(
                      pensionAdministrator.contactMethods,
                      ContactMethods.WEB_CONTACTS,
                    ) && (
                      <div className="mb-4">
                        <div className="font-bold">Online form</div>
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
                      <div className="mb-4">
                        <div className="font-bold">Address</div>
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
                      </div>
                    )}
                  </ExpandableSection>
                </div>
              </InformationCallout>
            ),
          )}
        </div>
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookies = new Cookies(req, res);
  const userSession = getUserSessionFromCookies(cookies);

  try {
    const { unconfirmedPensions: data } = await getAllPensions(userSession);

    if (!data) {
      return { notFound: true };
    }

    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.error('Error fetching unconfirmed pensions:', error);
    return { notFound: true };
  }
};
