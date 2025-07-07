import { H1, Heading } from '@maps-react/common/components/Heading';
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
  heading?: string;
  title?: string;
  hasTitle?: boolean;
};

/**
 * ContactFormsLayout component
 * @param back - The name of the previous step
 * @param children - The component to render
 * @param errors - The errors array
 * @param step - The name of the current step
 * @param heading - The heading for the layout, defaults to 'layout.title'
 * @param title - The title for the layout, defaults to the translation of the step title
 * @param hasTitle - Whether to display the title, defaults to true
 * @returns JSX.Element
 */
export const ContactFormsLayout = ({
  back,
  children,
  errors,
  step,
  heading = 'layout.title',
  title,
  hasTitle = true,
}: ContactFormsLayoutProps) => {
  const { t } = useTranslation();

  const h1Title = title ?? t(`components.${step}.title`);

  return (
    <ToolPageLayout
      pageTitle={t('site.title')}
      noMargin={true}
      mainClassName="my-6 md:my-8 text-gray-800"
    >
      <Container>
        <div className="flex flex-col gap-6 mb-6 md:mb-8 md:gap-8 md:max-w-4xl">
          <Markdown
            className="mb-0 text-base font-bold leading-7"
            data-testid="layout-content"
            content={t('layout.content')}
          ></Markdown>
          <FormErrorCallout errors={errors} step={step} />
          <Heading
            level="h4"
            component="p"
            className="text-blue-800 md:mb-4"
            data-testid="layout-title"
          >
            {t(heading)}
          </Heading>
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
        </div>
        <div className="text-base md:max-w-4xl">
          {hasTitle && (
            <H1
              className="pr-20 mb-2 text-blue-800 md:mb-4"
              data-testid={`${step}-title`}
            >
              {h1Title}
            </H1>
          )}
          {children}
        </div>
      </Container>
    </ToolPageLayout>
  );
};
