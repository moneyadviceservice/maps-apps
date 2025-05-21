import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H1 } from '@maps-react/common/components/Heading';
import { TextInput } from '@maps-react/form/components/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { StepComponent } from '../../lib/types';
import { getFieldError, hasFieldError } from '../../lib/utils/';

export const ContactDetails: StepComponent = ({ errors, entry }) => {
  const { t, locale } = useTranslation();

  return (
    <>
      <H1 className="mb-4 text-blue-800" data-testid="contact-details-title">
        {t('components.contact-details.title')}
      </H1>
      <form
        action="/api/form-handler"
        method="POST"
        className="md:max-w-xl"
        noValidate
      >
        <input type="hidden" name="lang" value={locale} />
        <div className="flex flex-col gap-8 mb-12">
          <Errors errors={hasFieldError(errors, 'email')}>
            <TextInput
              id="email"
              name="email"
              label={t('components.contact-details.form.email.label')}
              hint={t('components.contact-details.form.email.hint')}
              type="text"
              data-testid="input-email"
              error={
                getFieldError(errors, 'email')
                  ? t('components.contact-details.form.email.error')
                  : undefined
              }
              defaultValue={entry?.data?.email ?? ''}
            />
          </Errors>
          <Errors errors={hasFieldError(errors, 'phone-number')}>
            <TextInput
              id="phone-number"
              name="phone-number"
              label={t('components.contact-details.form.phone-number.label')}
              hint={t('components.contact-details.form.phone-number.hint')}
              type="text"
              data-testid="input-phone-number"
              error={
                getFieldError(errors, 'phone-number')
                  ? t('components.contact-details.form.phone-number.error')
                  : undefined
              }
              defaultValue={entry?.data?.['phone-number'] ?? ''}
            />
          </Errors>
          <Errors errors={hasFieldError(errors, 'post-code')}>
            <TextInput
              id="post-code"
              name="post-code"
              label={t('components.contact-details.form.post-code.label')}
              hint={t('components.contact-details.form.post-code.hint')}
              type="text"
              data-testid="input-post-code"
              error={
                getFieldError(errors, 'post-code')
                  ? t('components.contact-details.form.post-code.error')
                  : undefined
              }
              defaultValue={entry?.data?.['post-code'] ?? ''}
            />
          </Errors>
        </div>
        <ExpandableSection
          title={t('components.contact-details.expandable-section.title')}
        >
          <Markdown
            content={t('components.contact-details.expandable-section.content')}
          ></Markdown>
        </ExpandableSection>
        <Button type="submit" className="mt-9" data-testid="continue-button">
          {t('common.continue')}
        </Button>
      </form>
    </>
  );
};
