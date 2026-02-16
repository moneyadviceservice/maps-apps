import { H1, Heading, Icon, IconType } from '@maps-digital/shared/ui';
import { twMerge } from 'tailwind-merge';

import { Container } from '@maps-react/core/components/Container';
import useTranslation from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { FormErrorCallout } from '../../components';
import { FormError } from '../../types/index';

export type FormsLayoutProps = {
  back?: string;
  children: React.ReactNode;
  errors?: FormError;
  step: string;
  heading?: string;
  title?: string;
  hasTitle?: boolean;
  hasLayoutContent?: boolean; // For contact forms
  layoutContent?: string; // For contact forms
  hasFullWidth?: boolean;
  sidebar?: React.ReactNode; // Added to allow custom sidebar injection
};

/**
 * FormLayout component
 * @param back - The name of the previous step
 * @param children - The component to render
 * @param errors - The errors array
 * @param step - The name of the current step
 * @param heading - The heading for the layout
 * @param title - The title for the layout, defaults to the translation of the step title
 * @param hasTitle - Whether to display the title, defaults to true
 * @param hasLayoutContent - Whether to display the layout content, defaults to false
 * @param layoutContent - The layout content to display (for contact forms)
 * @param hasFullWidth - Whether to use full width layout, defaults to false
 * @returns JSX.Element
 */
export const FormsLayout = ({
  back,
  children,
  errors,
  step,
  heading,
  title,
  hasTitle = true,
  hasLayoutContent = false, // Default false, Contact Forms passes true
  layoutContent, // Only Contact Forms provides this
  hasFullWidth = false,
  sidebar,
}: FormsLayoutProps) => {
  const { t } = useTranslation();
  const h1Title = title ?? t(`components.${step}.title`);

  return (
    <ToolPageLayout
      pageTitle={t('site.title')}
      noMargin={true}
      mainClassName="mt-8 mb-0 md:mb-8 text-gray-800"
    >
      <Container>
        <div className="flex flex-col gap-6 mb-6 md:mb-8 md:gap-8 md:max-w-4xl">
          {/* Only renders if hasLayoutContent is true AND layoutContent exists */}
          {hasLayoutContent && layoutContent && (
            <div data-testid="layout-content">
              <Markdown
                className="mb-0 text-base font-bold leading-7"
                content={layoutContent}
              />
            </div>
          )}

          {heading && (
            <Heading
              level="h4"
              component="p"
              className="text-blue-700 md:mb-4"
              data-testid="layout-title"
            >
              {t(heading)}
            </Heading>
          )}

          {back && (
            <div
              className="flex items-center text-magenta-500 group"
              data-testid="back-link"
            >
              <Icon
                type={IconType.CHEVRON_LEFT}
                className="text-magenta-500 group-hover:text-pink-800 w-[8px] h-[15px]"
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

          <FormErrorCallout errors={errors} step={step} />
        </div>

        <div
          className={
            sidebar ? 'lg:flex lg:justify-between lg:gap-6' : undefined
          }
        >
          <section
            className={twMerge(
              'text-base flex-1',
              !hasFullWidth && 'md:max-w-4xl',
            )}
          >
            {hasTitle && (
              <H1
                className={twMerge(`mb-2  md:mb-4 lg:pr-20`)}
                data-testid={`${step}-title`}
              >
                {h1Title}
              </H1>
            )}
            {children}
          </section>

          {sidebar && (
            <aside
              className="w-full md:w-[300px] mt-6 lg:mt-0"
              data-testid="sidebar"
            >
              {sidebar}
            </aside>
          )}
        </div>
      </Container>
    </ToolPageLayout>
  );
};
