import { Metadata, NextPage } from 'next';
import { PensionsDashboardLayout } from '../../../layouts/PensionsDashboardLayout';
import { SITE_TITLE } from '../../../utils/constants';
import { getUnconfirmedPensions } from '../../../utils/fetch/get-unconfirmed-pensions';
import { ExpandableSection } from '@maps-digital/ui/components/ExpandableSection';
import { Heading } from '@maps-digital/ui/components/Heading';
import { Icon, IconType } from '@maps-digital/ui/components/Icon';
import { InformationCallout } from '@maps-digital/ui/components/InformationCallout';
import { Paragraph } from '@maps-digital/ui/components/Paragraph';

const title = 'Pensions that need action';
const breadcrumb = [
  { label: 'Pensions found', link: '/en/overview' },
  { label: title, link: '/en/pensions-that-need-action' },
];

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: `${title} | ${SITE_TITLE}`,
  };
};

const Page: NextPage = async () => {
  const data = await getUnconfirmedPensions();

  return (
    <PensionsDashboardLayout
      title={title}
      breadcrumb={breadcrumb}
      showCommonLinks={true}
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 lg:col-span-2">
          <Paragraph>
            These pensions only match some of your details. We need more
            information to confirm they belong to you.
          </Paragraph>
          {data.map(
            ({
              schemeName,
              contactReference,
              pensionAdministrator,
              externalAssetId,
            }) => (
              <InformationCallout
                key={externalAssetId}
                className="mt-8 py-8 px-6 pb-2"
              >
                <Heading level="h4" className="flex gap-2 items-top mb-4">
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
                <Paragraph className="font-bold mb-0">
                  Reference number
                </Paragraph>
                <Paragraph>{contactReference}</Paragraph>
                <div className="border-t-1 py-4 mt-8">
                  <ExpandableSection title="Show contact details">
                    <Paragraph>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Sunt aliquam debitis iusto ab, temporibus sit harum hic
                      quod officiis. Distinctio corporis dignissimos pariatur
                      illum quibusdam, nostrum sunt sit magni ipsa.
                    </Paragraph>
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
