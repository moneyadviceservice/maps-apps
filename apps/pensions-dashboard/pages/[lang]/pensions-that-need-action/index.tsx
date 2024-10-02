import { GetServerSideProps, NextPage } from 'next';
import Cookies from 'cookies';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Link } from '@maps-react/common/components/Link';
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

const Page: NextPage<PensionsDashboardLayoutProps & PageProps> = ({
  title,
  breadcrumb,
  data,
}) => {
  return (
    <PensionsDashboardLayout
      title={title}
      breadcrumb={breadcrumb}
      showCommonLinks={true}
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="lg:col-span-2 col-span-3">
          <Paragraph>
            These pensions only match some of your details. We need more
            information to confirm they belong to you.
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
                    className="scale-[.8] m-[-12px] min-w-16"
                  />
                  {schemeName}
                </Heading>
                <Paragraph>
                  Contact {pensionAdministrator.name} and give them your
                  reference number. They’ll ask for your details and confirm
                  whether this pension belongs to you. If confirmed, it will
                  show up in your pensions breakdown.
                </Paragraph>
                <Paragraph className="mb-0 font-bold">
                  Reference number
                </Paragraph>
                <Paragraph>{contactReference}</Paragraph>
                <div className="border-t-1 py-4 mt-8">
                  <ExpandableSection title="Show contact details">
                    {hasPreferred(pensionAdministrator.contactMethods) && (
                      <div className="mb-4">
                        <div className="font-bold">
                          Best way to contact your provider with queries
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
                        <div className="font-bold">Telephone number</div>
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
                        <div className="font-bold">Email</div>
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

    const title = 'Pensions that need action';
    const breadcrumb = [
      { label: 'Pensions found', link: '/en/overview' },
      { label: title, link: '/en/pensions-that-need-action' },
    ];

    return {
      props: {
        title,
        breadcrumb,
        data,
      },
    };
  } catch (error) {
    console.error('Error fetching unconfirmed pensions:', error);
    return { notFound: true };
  }
};
