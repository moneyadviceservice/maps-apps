import { NextPage } from 'next';

import { Heading } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import {
  PensionsDashboardLayout,
  PensionsDashboardLayoutProps,
} from '../../../layouts/PensionsDashboardLayout';

const Page: NextPage<PensionsDashboardLayoutProps> = () => {
  const { t, tList } = useTranslation();
  const title = t('pages.no-pensions-found.title');
  const items = tList('pages.no-pensions-found.items');

  return (
    <PensionsDashboardLayout title={title} helpAndSupport>
      <div className="xl:grid xl:grid-cols-10 xl:gap-4">
        <div className="xl:col-span-8 2xl:col-span-7">
          <ToolIntro className="mt-4 mb-10 text-2xl">
            {t('pages.no-pensions-found.tooltip')}
          </ToolIntro>
          <Heading level="h2" className="mb-4">
            {t('pages.no-pensions-found.heading')}
          </Heading>
          <ListElement
            items={items.map((item: string) => (
              <Markdown
                key={item.slice(0, 8)}
                className="mb-1"
                content={item}
              />
            ))}
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
