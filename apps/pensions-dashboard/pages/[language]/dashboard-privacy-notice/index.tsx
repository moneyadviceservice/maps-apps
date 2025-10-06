import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { List, Section } from '../../../components/PolicyPageComponents';
import { QuickLinks } from '../../../components/QuickLinks';
import { PensionsDashboardLayout } from '../../../layouts/PensionsDashboardLayout';
import { getMhpdSessionConfig } from '../../../lib/utils';

type PageProps = {
  backLink: string;
};

const Page: NextPage<PageProps> = ({ backLink }) => {
  const { t, tList, locale } = useTranslation();
  const title = t('pages.privacy-policy.title');

  const quickLinkText = [
    ...Array.from({ length: 11 }, (_, i) =>
      t(`pages.privacy-policy.title${i + 1}`),
    ),
  ];

  return (
    <PensionsDashboardLayout
      title={title}
      seoTitle={t('pages.privacy-policy.seo-title')}
      isOffset={false}
      back={`/${locale}${backLink}`}
      toTopLink={false}
      enableTimeOut={false}
      isLoggedInPage={false}
    >
      <>
        <Heading level="h2" component="h2" className="mb-3 md:pt-4">
          {t('common.guide-title')}
        </Heading>
        <QuickLinks linkText={quickLinkText} />
        <div className="lg:grid lg:grid-cols-12">
          <div className="lg:col-span-10 xl:col-span-8 2xl:col-span-7">
            <Section id="1" title={t('pages.privacy-policy.title1')}>
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph1-1')}
              </Paragraph>
              <List items={tList('pages.privacy-policy.items1-1')} />
              <Markdown content={t('pages.privacy-policy.paragraph1-2')} />
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph1-3')}
              </Paragraph>
              <List items={tList('pages.privacy-policy.items1-2')} />
              <Markdown content={t('pages.privacy-policy.paragraph1-4')} />
            </Section>

            <Section id="2" title={t('pages.privacy-policy.title2')}>
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph2-1')}
              </Paragraph>
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph2-2')}
              </Paragraph>
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph2-3')}
              </Paragraph>
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph2-4')}
              </Paragraph>
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph2-5')}
              </Paragraph>
              <Markdown
                className="md:mb-6"
                content={t('pages.privacy-policy.paragraph2-6')}
              />
              <Markdown content={t('pages.privacy-policy.paragraph2-7')} />
            </Section>

            <Section id="3" title={t('pages.privacy-policy.title3')}>
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph3-1')}
              </Paragraph>
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph3-2')}
              </Paragraph>
              <List
                variant="ordered"
                items={tList('pages.privacy-policy.items3-1')}
              />
              <List items={tList('pages.privacy-policy.items3-1-1')} />
              <List
                variant="ordered"
                start={2}
                items={tList('pages.privacy-policy.items3-2')}
              />
              <List items={tList('pages.privacy-policy.items3-2-1')} />
              <List
                variant="ordered"
                start={3}
                items={tList('pages.privacy-policy.items3-3')}
              />
              <Paragraph>{t('pages.privacy-policy.paragraph3-3')}</Paragraph>
            </Section>

            <Section id="4" title={t('pages.privacy-policy.title4')}>
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph4-1')}
              </Paragraph>
              <List
                variant="ordered"
                items={tList('pages.privacy-policy.items4-1')}
              />
            </Section>

            <Section id="5" title={t('pages.privacy-policy.title5')}>
              <Markdown
                className="md:mb-6"
                content={t('pages.privacy-policy.paragraph5-1')}
              />
              <List
                items={tList('pages.privacy-policy.items5-1')}
                variant="ordered"
              />
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph5-2')}
              </Paragraph>
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph5-3')}
              </Paragraph>
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph5-4')}
              </Paragraph>
            </Section>

            <Section id="6" title={t('pages.privacy-policy.title6')}>
              <Markdown
                className="md:mb-6"
                content={t('pages.privacy-policy.paragraph6-1')}
              />
              <Markdown
                className="md:mb-6"
                content={t('pages.privacy-policy.paragraph6-2')}
              />
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph6-3')}
              </Paragraph>
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph6-4')}
              </Paragraph>
            </Section>

            <Section id="7" title={t('pages.privacy-policy.title7')}>
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph7-1')}
              </Paragraph>
            </Section>

            <Section id="8" title={t('pages.privacy-policy.title8')}>
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph8-1')}
              </Paragraph>
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph8-2')}
              </Paragraph>
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph8-3')}
              </Paragraph>
            </Section>

            <Section id="9" title={t('pages.privacy-policy.title9')}>
              <Markdown content={t('pages.privacy-policy.paragraph9-1')} />
            </Section>

            <Section id="10" title={t('pages.privacy-policy.title10')}>
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph10-1')}
              </Paragraph>
              <List
                items={tList('pages.privacy-policy.items10-1')}
                variant="ordered"
              />
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph10-2')}
              </Paragraph>
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph10-3')}
              </Paragraph>
              <Paragraph>{t('pages.privacy-policy.paragraph10-4')}</Paragraph>
            </Section>

            <Section id="11" title={t('pages.privacy-policy.title11')}>
              <Paragraph className="md:mb-6">
                {t('pages.privacy-policy.paragraph11-1')}
              </Paragraph>
              <Markdown content={t('pages.privacy-policy.paragraph11-2')} />
            </Section>
          </div>
        </div>
      </>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const { currentUrl } = getMhpdSessionConfig(cookies);
  const backLink = currentUrl ?? '/';

  return {
    props: {
      backLink,
    },
  };
};
