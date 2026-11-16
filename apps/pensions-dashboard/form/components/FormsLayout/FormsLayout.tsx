import { twMerge } from 'tailwind-merge';
import { H1, Heading } from '@maps-digital/shared/ui';

import { BackLink } from '@maps-react/common/components/BackLink';
import useTranslation from '@maps-react/hooks/useTranslation';
import { FormErrorCallout } from '@maps-react/mhf/components';
import { FormError } from '@maps-react/mhf/types';

import { PensionsDashboardLayout } from '../../../layouts/PensionsDashboardLayout';
import { FORM_BASE_PATH } from '../../constants';

export type FormsLayoutProps = {
  back?: string;
  children: React.ReactNode;
  errors?: FormError;
  step: string;
  heading?: string;
  title?: string;
  hasTitle?: boolean;
  hasFullWidth?: boolean;
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
  hasFullWidth = false,
}: FormsLayoutProps) => {
  const { t, locale } = useTranslation();
  const h1Title = title ?? t(`${FORM_BASE_PATH}/components.${step}.title`);
  const isExternalBack = back?.startsWith('http');

  return (
    <PensionsDashboardLayout
      isOffset={false}
      seoTitle={t(`${FORM_BASE_PATH}/components.${step}.title`)}
      isLoggedInPage={false}
      toTopLink={false}
      showToolFeedBack={false}
      showPhaseBanner={false}
      enableTimeOut={false}
    >
      <div className="flex flex-col gap-6 mt-14 md:gap-8">
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
          <span>
            <BackLink
              href={
                isExternalBack ? back : `/${locale}/${FORM_BASE_PATH}/${back}`
              }
            >
              {t('site.back')}
            </BackLink>
          </span>
        )}

        {errors && Object.keys(errors).length > 0 && (
          <div className="lg:gap-8 lg:grid lg:grid-cols-12">
            <div className="lg:col-span-10 xl:col-span-8 2xl:col-span-7">
              <FormErrorCallout
                errors={errors}
                step={step}
                translationPath={FORM_BASE_PATH}
              />
            </div>
          </div>
        )}
      </div>

      <section className="mt-6 text-base lg:gap-8 lg:grid lg:grid-cols-12 md:mt-8">
        <div
          className={twMerge(
            hasFullWidth && '!col-span-12',
            'lg:col-span-10 xl:col-span-8 2xl:col-span-7',
          )}
        >
          {hasTitle && (
            <H1
              className={twMerge(`mb-2  md:mb-4`)}
              data-testid={`${step}-title`}
            >
              {h1Title}
            </H1>
          )}
          <div className="mt-10 md:mt-12">{children}</div>
        </div>
      </section>
    </PensionsDashboardLayout>
  );
};
