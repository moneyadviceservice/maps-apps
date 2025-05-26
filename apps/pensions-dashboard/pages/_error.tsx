import { NextPage } from 'next';

import { Heading } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionsDashboardLayout } from '../layouts/PensionsDashboardLayout';

const ErrorPage: NextPage = () => {
  const { t, tList } = useTranslation();
  const items = tList('pages.error.what-you-can-do.items');

  return (
    <PensionsDashboardLayout title={t('pages.error.title')} helpAndSupport>
      <ToolIntro className="my-6 text-lg md:text-2xl md:mt-12 md:mb-10 md:max-w-4xl">
        {t('pages.error.intro')}
      </ToolIntro>

      <Heading level="h2" component="h2" className="mb-2">
        {t('pages.error.what-you-can-do.title')}
      </Heading>

      <ListElement
        items={items.map((item: string) => (
          <Markdown key={item.slice(0, 8)} className="mb-4" content={item} />
        ))}
        color="dark"
        variant="unordered"
        className="mt-6 ml-8 list-disc text-md md:mt-0"
      />
    </PensionsDashboardLayout>
  );
};

export default ErrorPage;
