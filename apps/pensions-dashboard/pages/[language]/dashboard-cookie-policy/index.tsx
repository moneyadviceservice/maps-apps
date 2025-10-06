import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';
import { twMerge } from 'tailwind-merge';

import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Table } from '@maps-react/common/components/Table';
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
  const title = t('pages.cookie-policy.title');

  const quickLinkText = [
    ...Array.from({ length: 6 }, (_, i) =>
      t(`pages.cookie-policy.title${i + 1}`),
    ),
  ];

  const tableClasses = '[&_td:first-of-type]:w-1/5 [&_td:last-of-type]:w-1/5';

  const tableHeadings = [
    t('pages.cookie-policy.table-headings.name'),
    t('pages.cookie-policy.table-headings.purpose'),
    t('pages.cookie-policy.table-headings.expires'),
  ];

  return (
    <PensionsDashboardLayout
      title={title}
      seoTitle={t('pages.cookie-policy.seo-title')}
      isOffset={false}
      back={`/${locale}${backLink}`}
      toTopLink={false}
      enableTimeOut={false}
      isLoggedInPage={false}
    >
      <>
        <div className="lg:grid lg:grid-cols-12">
          <div className="lg:col-span-10 xl:col-span-8 2xl:col-span-7">
            <Paragraph className="md:mb-10">
              {t('pages.cookie-policy.intro')}
            </Paragraph>
          </div>
        </div>
        <Heading level="h2" component="h2" className="mb-3 md:pt-4">
          {t('common.guide-title')}
        </Heading>
        <QuickLinks linkText={quickLinkText} />
        <div className="lg:grid lg:grid-cols-12">
          <div className="lg:col-span-10 xl:col-span-8 2xl:col-span-7">
            <Section id="1" title={t('pages.cookie-policy.title1')}>
              <Paragraph className="md:mb-6">
                {t('pages.cookie-policy.paragraph1-1')}
              </Paragraph>
              <Paragraph className="md:mb-6">
                {t('pages.cookie-policy.paragraph1-2')}
              </Paragraph>
              <List items={tList('pages.cookie-policy.items1-2')} />
              <Paragraph className="md:mb-6">
                {t('pages.cookie-policy.paragraph1-3')}
              </Paragraph>
              <Paragraph className="md:mb-6">
                {t('pages.cookie-policy.paragraph1-4')}
              </Paragraph>
              <Markdown content={t('pages.cookie-policy.paragraph1-5')} />
            </Section>

            <Section id="2" title={t('pages.cookie-policy.title2')}>
              <Paragraph className="md:mb-6">
                {t('pages.cookie-policy.paragraph2-1')}
              </Paragraph>
              <Heading level="h3" component="h3" className="mb-3 md:pt-4">
                {t('pages.cookie-policy.title2-1')}
              </Heading>
              <div className={twMerge(tableClasses)}>
                <Table
                  columnHeadings={tableHeadings}
                  data={[
                    [
                      'codeVerifier',
                      t('pages.cookie-policy.table-rows.codeVerifier'),
                      t('pages.cookie-policy.session-expiry'),
                    ],
                  ]}
                />
              </div>
              <Heading level="h3" component="h3" className="mb-3 md:pt-4">
                {t('pages.cookie-policy.title2-2')}
              </Heading>
              <div className={twMerge(tableClasses)}>
                <Table
                  columnHeadings={tableHeadings}
                  data={[
                    [
                      'mhpdSessionConfig',
                      t('pages.cookie-policy.table-rows.mhpdSessionConfig'),
                      t('pages.cookie-policy.session-expiry'),
                    ],
                    [
                      'beaconId',
                      t('pages.cookie-policy.table-rows.beaconId'),
                      t('pages.cookie-policy.table-rows.beaconIdExpiry'),
                    ],
                  ]}
                />
              </div>
            </Section>

            <Section id="3" title={t('pages.cookie-policy.title3')}>
              <Paragraph className="md:mb-6">
                {t('pages.cookie-policy.paragraph3-1')}
              </Paragraph>
              <Heading level="h3" component="h3" className="mb-3 md:pt-4">
                {t('pages.cookie-policy.title3-1')}
              </Heading>
              <div
                className={twMerge(
                  tableClasses,
                  '[&_td:first-of-type]:break-all',
                )}
              >
                <Table
                  columnHeadings={tableHeadings}
                  data={[
                    [
                      'iPlanetDirectoryPro',
                      t('pages.cookie-policy.table-rows.iPlanetDirectoryPro'),
                      t('pages.cookie-policy.table-rows.findExpires120'),
                    ],
                    [
                      'amlbcookie',
                      t('pages.cookie-policy.table-rows.amlbcookie'),
                      t('pages.cookie-policy.table-rows.findExpires120'),
                    ],
                    [
                      'route',
                      t('pages.cookie-policy.table-rows.route'),
                      t('pages.cookie-policy.table-rows.findExpires120'),
                    ],
                    [
                      'reentry',
                      t('pages.cookie-policy.table-rows.reentry'),
                      t('pages.cookie-policy.table-rows.findExpires15'),
                    ],
                    [
                      'OAUTH_REQUEST_ATTRIBUTES',
                      t(
                        'pages.cookie-policy.table-rows.oAuthRequestAttributes',
                      ),
                      t('pages.cookie-policy.table-rows.findExpires5'),
                    ],
                  ]}
                />
              </div>
            </Section>

            <Section id="4" title={t('pages.cookie-policy.title4')}>
              <Paragraph className="md:mb-6">
                {t('pages.cookie-policy.paragraph4-1')}
              </Paragraph>
              <Paragraph className="md:mb-6">
                {t('pages.cookie-policy.paragraph4-2')}
              </Paragraph>
              <Paragraph className="md:mb-6">
                {t('pages.cookie-policy.paragraph4-3')}
              </Paragraph>
              <Heading level="h3" component="h3" className="mb-3 md:pt-4">
                {t('pages.cookie-policy.title4-1')}
              </Heading>
              <div className={twMerge(tableClasses)}>
                <Table
                  title="Microsoft Clarity"
                  columnHeadings={tableHeadings}
                  data={[
                    [
                      '_clck',
                      t('pages.cookie-policy.table-rows.clck'),
                      `13 ${t('common.months')}`,
                    ],
                    [
                      '_clsk',
                      t('pages.cookie-policy.table-rows.clsk'),
                      `1 ${t('common.year')}`,
                    ],
                    [
                      'CLID',
                      t('pages.cookie-policy.table-rows.clid'),
                      `13 ${t('common.months')}`,
                    ],
                    [
                      'ANONCHK',
                      t('pages.cookie-policy.table-rows.anonchk'),
                      `13 ${t('common.months')}`,
                    ],
                    [
                      'MR',
                      t('pages.cookie-policy.table-rows.mr'),
                      `13 ${t('common.months')}`,
                    ],
                    [
                      'MUID (Microsoft User ID)',
                      t('pages.cookie-policy.table-rows.muid'),
                      `13 ${t('common.months')}`,
                    ],
                    [
                      'SM',
                      t('pages.cookie-policy.table-rows.sm'),
                      `13 ${t('common.months')}`,
                    ],
                  ]}
                />
              </div>
              <div
                className={twMerge(
                  tableClasses,
                  '[&_td:first-of-type]:break-all',
                )}
              >
                <Table
                  title="Google Analytics"
                  columnHeadings={tableHeadings}
                  data={[
                    [
                      '_ga',
                      t('pages.cookie-policy.table-rows.ga'),
                      `2 ${t('common.years')}`,
                    ],
                    [
                      '_gid',
                      t('pages.cookie-policy.table-rows.gid'),
                      `24 ${t('common.hours')}`,
                    ],
                    [
                      '_ga_<container-id>',
                      t('pages.cookie-policy.table-rows.gaContainerId'),
                      `1 ${t('common.minute')}`,
                    ],
                    [
                      '_gat_gtag_<container-id>',
                      t('pages.cookie-policy.table-rows.gatGtagContainerId'),
                      `1 ${t('common.minute')}`,
                    ],
                    [
                      '_utma',
                      t('pages.cookie-policy.table-rows.utma'),
                      `2 ${t('common.years')}`,
                    ],
                    [
                      '_gat_UA',
                      t('pages.cookie-policy.table-rows.gatUa'),
                      `10 ${t('common.minutes')}`,
                    ],
                  ]}
                />

                <Table
                  title="glassbox"
                  columnHeadings={tableHeadings}
                  data={[
                    [
                      '_cls_s',
                      t('pages.cookie-policy.table-rows.clss'),
                      t('pages.cookie-policy.session-expiry'),
                    ],
                    [
                      '_cls_v',
                      t('pages.cookie-policy.table-rows.clsv'),
                      `1 ${t('common.year')}`,
                    ],
                    [
                      'Bc',
                      t('pages.cookie-policy.table-rows.bc'),
                      t('pages.cookie-policy.session-expiry'),
                    ],
                  ]}
                />

                <Table
                  title="Adobe marketing cloud"
                  columnHeadings={tableHeadings}
                  data={[
                    [
                      's_ecid',
                      t('pages.cookie-policy.table-rows.secid'),
                      `2 ${t('common.years')}`,
                    ],
                    [
                      's_cc',
                      t('pages.cookie-policy.table-rows.scc'),
                      t('pages.cookie-policy.session-expiry'),
                    ],
                    [
                      's_sq',
                      t('pages.cookie-policy.table-rows.ssq'),
                      t('pages.cookie-policy.session-expiry'),
                    ],
                    [
                      's_vi',
                      t('pages.cookie-policy.table-rows.svi'),
                      `2 ${t('common.years')}`,
                    ],
                    [
                      's_fid',
                      t('pages.cookie-policy.table-rows.sfid'),
                      `2 ${t('common.years')}`,
                    ],
                    [
                      's_ac',
                      t('pages.cookie-policy.table-rows.sac'),
                      t('common.immediate'),
                    ],
                    [
                      'mbox',
                      t('pages.cookie-policy.table-rows.mbox'),
                      `2 ${t('common.years')}`,
                    ],
                    [
                      'at_check',
                      t('pages.cookie-policy.table-rows.atcheck'),
                      t('pages.cookie-policy.session-expiry'),
                    ],
                  ]}
                />
              </div>
            </Section>

            <Section id="5" title={t('pages.cookie-policy.title5')}>
              <Paragraph className="md:mb-6">
                {t('pages.cookie-policy.paragraph5-1')}
              </Paragraph>
              <Paragraph className="md:mb-6">
                {t('pages.cookie-policy.paragraph5-2')}
              </Paragraph>
            </Section>

            <Section id="6" title={t('pages.cookie-policy.title6')}>
              <Paragraph className="md:mb-6">
                {t('pages.cookie-policy.paragraph6-1')}
              </Paragraph>
              <Markdown content={t('pages.cookie-policy.paragraph6-2')} />
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
