import { ReactNode } from 'react';

import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';
import { Paragraph } from '@maps-digital/shared/ui';

import { Heading } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { LogoutLinkText } from '../../../components/Logout';
import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';
import { getMhpdSessionConfig } from '../../../lib/utils/system';

type Props = {
  backLink: string;
};

const Page: NextPage<PensionsDashboardLayoutProps & Props> = ({ backLink }) => {
  const { t, locale } = useTranslation();
  const title = t('pages.pensions-not-showing.title');

  const items = [
    t('pages.pensions-not-showing.to-do.item-1'),
    <Paragraph key="item-2">
      {t('pages.pensions-not-showing.to-do.item-2')}{' '}
      <LogoutLinkText
        text={t('pages.pensions-not-showing.to-do.item-2-logout-link')}
        testId="pensions-not-showing-logout-link"
      />
    </Paragraph>,
    t('pages.pensions-not-showing.to-do.item-3'),
    t('pages.pensions-not-showing.to-do.item-4'),
    t('pages.pensions-not-showing.to-do.item-5'),
  ].map((item: string | ReactNode, index) =>
    typeof item === 'string' ? (
      <Markdown key={`item-${index}`} content={item} />
    ) : (
      <>{item}</>
    ),
  );

  return (
    <PensionsDashboardLayout
      title={title}
      back={`/${locale}${backLink}`}
      backText={t('site.back')}
      isOffset={false}
      helpAndSupport
    >
      <div className="xl:grid xl:grid-cols-12 xl:gap-6">
        <div className="xl:col-span-8">
          <ToolIntro className="mb-8 md:text-2xl">
            {t('pages.pensions-not-showing.intro')}
          </ToolIntro>

          <Heading level="h2" className="mb-4">
            {t('pages.pensions-not-showing.heading')}
          </Heading>

          <ListElement
            items={items}
            variant="unordered"
            color="blue"
            className="ml-8 list-disc text-md"
          />
        </div>
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookies = new Cookies(req, res);
  const { currentUrl } = getMhpdSessionConfig(cookies);
  const backLink = currentUrl ?? null;

  return {
    props: {
      backLink,
    },
  };
};
