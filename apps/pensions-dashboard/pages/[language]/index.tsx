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
import { useMHPDAnalytics } from '../../lib/hooks/useMHPDAnalytics';
import { storeCurrentUrl } from '../../lib/utils/system';

const Page: NextPage = () => {
  const { z, t, tList, locale } = useTranslation();

  // Track analytics for this page
  useMHPDAnalytics({
    isDashboard: false,
  });

  return (
    <PensionsDashboardLayout
      isOffset={false}
      toTopLink={true}
      enableTimeOut={false}
      isLoggedInPage={false}
    >
      <div className="relative overflow-hidden md:bg-[#FCFBF9]">
        <div className="absolute inset-0 h-full bg-left bg-no-repeat bg-cover lg:bg-right lg:bg-contain md:bg-welcome_lg md:translate-x-1/2 lg:translate-x-1/3 xl:translate-x-60 2xl:translate-x-40"></div>
        <div className="relative md:p-10">
          <Heading
            level="h1"
            variant="secondary"
            className="mb-6 md:mb-4 leading-[1.3] lg:w-2/3 xl:w-1/2"
            id="top"
            tabIndex={-1}
          >
            {t('site.title')}
          </Heading>
          <Paragraph className="text-lg text-blue-700 md:text-2xl lg:w-2/3 xl:w-1/2 text-balance">
            {t('pages.start.hero-text')}
          </Paragraph>
          <Image
            src={z({
              en: '/footer/gov.svg',
              cy: '/footer/gov-cy.svg',
            })}
            width="190"
            height="64"
            alt={z({
              en: 'HM Government logo',
              cy: 'Logo Llywodraeth EM',
            })}
            className="my-7 lg:my-12 max-md:w-[146px] max-md:h-[49px]"
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
      <div className="mt-6 lg:mt-16 lg:grid lg:gap-2 lg:grid-cols-2 text-pretty">
        <div className="lg:col-span-1">
          <Heading level="h2" variant="secondary" className="mb-6 md:mb-8">
            {t('pages.start.section-you-can.title')}
          </Heading>

          <ListElement
            items={tList('pages.start.section-you-can.items').map(
              (item: string) => (
                <Markdown key={item.slice(0, 8)} content={item} />
              ),
            )}
            variant="unordered"
            color="blue"
            className="mb-2 ml-10"
          />

          <Heading
            level="h2"
            variant="secondary"
            className="mt-4 mb-6 md:mt-10 md:mb-8"
          >
            {t('pages.start.section-how-it-works.title')}
          </Heading>

          <ListElement
            items={tList('pages.start.section-how-it-works.items').map(
              (item: string) => (
                <Markdown key={item.slice(0, 8)} content={item} />
              ),
            )}
            variant="ordered"
            color="blue"
            className="mb-2 ml-10"
          />

          <Heading
            level="h2"
            variant="secondary"
            className="mt-4 mb-6 md:mt-10 md:mb-8"
          >
            {t('pages.start.section-you-need.title')}
          </Heading>

          <ListElement
            items={tList('pages.start.section-you-need.items').map(
              (item: string) => (
                <Markdown key={item.slice(0, 8)} content={item} />
              ),
            )}
            variant="unordered"
            color="blue"
            className="mb-2 ml-10"
          />

          <Paragraph className="mb-4">
            {t('pages.start.section-you-need.easier')}
          </Paragraph>

          <ListElement
            items={tList('pages.start.section-you-need.easier-items').map(
              (item: string) => (
                <Markdown key={item.slice(0, 8)} content={item} />
              ),
            )}
            variant="unordered"
            color="blue"
            className="mb-2 ml-10"
          />

          <Markdown content={t('pages.start.section-you-need.other-ways')} />

          <Heading
            level="h2"
            variant="secondary"
            className="mt-4 mb-6 md:mt-10 md:mb-8"
          >
            {t('pages.start.section-your-data.title')}
          </Heading>

          <Markdown
            className="md:mt-8"
            content={t('pages.start.section-your-data.description')}
          />

          <ExpandableSection
            title={t('pages.start.more-about-your-data.title')}
            testId="more-about-your-data-accordion"
          >
            {tList('pages.start.more-about-your-data.items').map(
              (item: string) => (
                <Markdown
                  key={item.slice(0, 8)}
                  content={item}
                  className="mb-7 lg:mt-3"
                />
              ),
            )}
          </ExpandableSection>

          <form action="/api/post-redirect" method="POST" className="md:my-12">
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
            />

            <ListElement
              items={tList(
                'pages.start.some-pensions-may-not-be-included.items',
              ).map((item: string) => (
                <Markdown key={item.slice(0, 8)} content={item} />
              ))}
              variant="unordered"
              color="blue"
              className="mb-4 ml-10"
            />

            <Markdown
              content={t(
                'pages.start.some-pensions-may-not-be-included.note-1',
              )}
              className="mb-6"
            />

            <Markdown
              content={t(
                'pages.start.some-pensions-may-not-be-included.note-2',
              )}
            />
          </ExpandableSection>
        </div>
        <div className="lg:col-span-1">
          <Image
            src="/images/dashboard-devices.webp"
            alt="Images of a mobile phone and multiple desktop views of the pensions dashboard"
            width={1100}
            height={1107}
            className="w-full my-4 md:mt-16 lg:pl-8 xl:pl-20 2xl:pl-40"
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
