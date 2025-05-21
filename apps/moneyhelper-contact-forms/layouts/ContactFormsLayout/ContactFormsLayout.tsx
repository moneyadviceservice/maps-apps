import { twMerge } from 'tailwind-merge';

import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { FormErrorCallout } from '../../components/FormErrorCallout';
import { FormError } from '../../lib/types';

export type ContactFormsLayoutProps = {
  back?: string;
  children: React.ReactNode;
  errors?: FormError[];
  step?: string;
  flow?: string;
};

/**
 * ContactFormsLayout component
 * @param back - The name of the previous step
 * @param children - The component to render
 * @param errors - The errors array
 * @param step - The name of the current step
 * @param flow - The name of the current flow
 * @returns JSX.Element
 */
export const ContactFormsLayout = ({
  back,
  children,
  errors,
  step,
  flow,
}: ContactFormsLayoutProps) => {
  const { t } = useTranslation();
  const breadcrumbs = [
    { label: t('site.breadcrumbs.step1'), link: '/' },
    { label: t('site.breadcrumbs.step2'), link: '/' },
    { label: t('site.breadcrumbs.step3'), link: '/' },
  ];

  // Fallback to default title and content when flow is not defined
  const heading = flow ? `layout.${flow}.title` : 'layout.title';
  const content = flow ? `layout.${flow}.content` : 'layout.content';

  return (
    <ToolPageLayout pageTitle={t('site.title')} breadcrumbs={breadcrumbs}>
      <Container>
        <div className={twMerge(back ? ['mb-6'] : 'mb-8')}>
          <Markdown
            className="mb-8 text-lg font-semibold leading-6 text-black"
            data-testid="layout-content"
            content={t(content)}
          ></Markdown>
          <FormErrorCallout errors={errors} step={step} />
          <Heading
            level="h2"
            component="p"
            className="text-blue-800"
            data-testid="layout-title"
          >
            {t(heading)}
          </Heading>
        </div>
        {back && (
          <div
            className="flex items-center text-pink-600 group"
            data-testid="back-link"
          >
            <Icon
              type={IconType.CHEVRON_LEFT}
              className="text-pink-600 group-hover:text-pink-800 w-[8px] h-[15px]"
              aria-hidden="true"
            />

            <a
              href={back}
              className="ml-2 underline tool-nav-prev group-hover:text-pink-800 group-hover:no-underline"
            >
              {t('site.back')}
            </a>
          </div>
        )}
        <div className={twMerge('text-base', back ? ['mt-6'] : '')}>
          {children}
        </div>
      </Container>
    </ToolPageLayout>
  );
};
