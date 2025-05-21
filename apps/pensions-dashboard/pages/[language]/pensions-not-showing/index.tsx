import { GetServerSideProps, NextPage } from 'next';

import Cookies from 'cookies';

import { Heading } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';

type Props = {
  backLink: string;
};

const Page: NextPage<PensionsDashboardLayoutProps & Props> = ({ backLink }) => {
  const { t, tList, locale } = useTranslation();
  const title = t('pages.pensions-not-showing.title');
  const items = tList('pages.pensions-not-showing.items');

  return (
    <PensionsDashboardLayout
      title={title}
      back={`/${locale}${backLink}`}
      backText={t('site.back')}
      helpAndSupport
    >
      <div className="py-8 md:max-w-4xl">
        <ToolIntro className="mb-8 md:text-2xl">
          {t('pages.pensions-not-showing.intro')}
        </ToolIntro>

        <Heading level="h2" className="mb-4">
          {t('pages.pensions-not-showing.heading')}
        </Heading>

        <ListElement
          items={items.map((item: string) => (
            <Markdown key={item.slice(0, 8)} className="mb-1" content={item} />
          ))}
          variant="unordered"
          color="blue"
          className="ml-8 list-disc text-md"
        />
      </div>
    </PensionsDashboardLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookies = new Cookies(req, res);
  const backLink = cookies.get('currentUrl') ?? null;

  return {
    props: {
      backLink,
    },
  };
};
