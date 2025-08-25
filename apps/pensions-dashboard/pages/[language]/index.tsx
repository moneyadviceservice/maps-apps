import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';

import { Button } from '@maps-react/common/components/Button';
import { Divider } from '@maps-react/common/components/Divider';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionsDashboardLayout } from '../../layouts/PensionsDashboardLayout';
import { storeCurrentUrl } from '../../lib/utils/storeCurrentUrl';

const Page: NextPage = () => {
  const { z, t, tList, locale } = useTranslation();

  const sectionYouCanItems = tList('pages.start.section-you-can.items');
  const howItWorksItems = tList('pages.start.section-how-it-works.items');
  const sectionYouNeedItems = tList('pages.start.section-you-need.items');
  const sectionSomePensionMatNotBeIncluded = tList(
    'pages.start.some-pensions-may-not-be-included.items',
  );

  return (
    <PensionsDashboardLayout
      isOffset={false}
      toTopLink={true}
      enableTimeOut={false}
      isLoggedInPage={false}
    >
      <div className="relative overflow-hidden md:bg-[#FCFBF9]">
        <div className="absolute inset-0 h-full bg-left bg-no-repeat bg-cover lg:bg-right lg:bg-contain md:bg-welcome_lg md:translate-x-1/2 lg:translate-x-1/3 xl:translate-x-60 2xl:translate-x-40"></div>
        <div className="relative md:p-12">
          <Heading
            level="h1"
            className="mb-4 text-blue-800 md:mb-6 lg:w-2/3 xl:w-1/2"
          >
            {t('site.title')}
          </Heading>
          <Paragraph className="text-xl text-blue-800 lg:w-1/2 text-balance">
            {t('pages.start.hero-text')}
          </Paragraph>
          <Image
            src={z({
              en: '/footer/gov.svg',
              cy: '/footer/gov-cy.svg',
            })}
            width="180"
            height="60"
            alt={z({
              en: 'H.M. Government logo',
              cy: 'Logo Llywodraeth E.M',
            })}
            className="my-10"
          />
        </div>
        <div className="flex md:hidden">
          <Image
            src="/images/hero-dashboard.png"
            alt="Man holding mobile laughing"
            width={250}
            height={100}
            className="object-cover w-full h-auto"
          />
        </div>
      </div>
      <div className="mt-6 lg:mt-20 lg:grid lg:gap-24 2xl:gap-64 lg:grid-cols-2 text-pretty">
        <div className="md:col-span-1">
          <Heading level="h3" className="mb-6 md:mb-4 !text-5xl">
            {t('pages.start.section-you-can.title')}
          </Heading>

          <ListElement
            items={sectionYouCanItems.map((item: string) => (
              <Markdown key={item.slice(0, 8)} content={item} />
            ))}
            variant="unordered"
            color="blue"
            className="ml-8"
          />

          <Heading
            level="h3"
            className="mt-4 mb-6 font-semibold md:mt-10 md:mb-4 !text-5xl"
          >
            {t('pages.start.section-how-it-works.title')}
          </Heading>

          <ListElement
            items={howItWorksItems.map((item: string) => (
              <Markdown key={item.slice(0, 8)} content={item} />
            ))}
            variant="ordered"
            color="blue"
            className="ml-8"
          />

          <Heading
            level="h3"
            className="mt-4 mb-6 font-semibold md:mt-10 md:mb-4 !text-5xl"
          >
            {t('pages.start.section-you-need.title')}
          </Heading>

          <ListElement
            items={sectionYouNeedItems.map((item: string) => (
              <Markdown key={item.slice(0, 8)} content={item} />
            ))}
            variant="unordered"
            color="blue"
            className="mb-6 ml-8"
          />

          <Markdown className="md:my-8" content={t('pages.start.disclosure')} />

          <form action="/api/post-redirect" method="POST" className="md:my-16">
            <input type="hidden" name="lang" value={locale} />
            <Button
              data-testid="start"
              variant="primary"
              type="submit"
              className="w-full my-3 md:my-0 md:w-auto"
            >
              {t('pages.start.form-button')}
            </Button>
          </form>

          <Divider />

          <ExpandableSection
            title={t('pages.start.some-pensions-may-not-be-included.title')}
          >
            <Markdown
              content={t('pages.start.some-pensions-may-not-be-included.text')}
              className="mt-4"
            />

            <ListElement
              items={sectionSomePensionMatNotBeIncluded.map((item: string) => (
                <Markdown key={item.slice(0, 8)} content={item} />
              ))}
              variant="unordered"
              color="blue"
              className="mb-4 ml-8"
            />
            <Markdown
              content={t('pages.start.some-pensions-may-not-be-included.note')}
            />
          </ExpandableSection>
        </div>
        <div className="md:col-span-1">
          <Image
            src="/images/dashboard-devices.png"
            alt="Images of a mobile phone and multiple desktop views of the pensions dashboard"
            width={285}
            height={353}
            className="w-full my-4 md:mt-14"
          />
        </div>
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  storeCurrentUrl(context);

  return {
    props: {},
  };
};
