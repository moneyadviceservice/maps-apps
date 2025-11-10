import { ReactNode } from 'react';

import { NextPage } from 'next';

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

const Page: NextPage<PensionsDashboardLayoutProps> = () => {
  const { t } = useTranslation();
  const title = t('pages.no-pensions-found.title');
  const items = [
    t('pages.no-pensions-found.to-do.item-1'),
    <Paragraph key="item-2">
      {t('pages.no-pensions-found.to-do.item-2')}{' '}
      <LogoutLinkText
        text={t('pages.no-pensions-found.to-do.item-2-logout-link')}
        testId="no-pensions-found-logout-link"
      />
    </Paragraph>,
    t('pages.no-pensions-found.to-do.item-3'),
    t('pages.no-pensions-found.to-do.item-4'),
    t('pages.no-pensions-found.to-do.item-5'),
    t('pages.no-pensions-found.to-do.item-6'),
  ].map((item: string | ReactNode, index) =>
    typeof item === 'string' ? (
      <Markdown key={`item-${index}`} content={item} />
    ) : (
      <>{item}</>
    ),
  );

  return (
    <PensionsDashboardLayout title={title} isOffset={false} helpAndSupport>
      <div className="xl:grid xl:grid-cols-12 xl:gap-6">
        <div className="xl:col-span-8">
          <ToolIntro className="mt-4 mb-10 text-2xl">
            {t('pages.no-pensions-found.tooltip')}
          </ToolIntro>
          <Heading level="h2" className="mb-4">
            {t('pages.no-pensions-found.heading')}
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
