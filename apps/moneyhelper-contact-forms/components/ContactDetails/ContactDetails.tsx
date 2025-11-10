import { Errors, ErrorType } from '@maps-react/common/components/Errors';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { TextInput } from '@maps-react/form/components/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import {
  FlowName,
  FLOWS_WITH_REQUIRED_PHONE_NUMBER,
} from '../../lib/constants';
import { StepComponent } from '../../lib/types';
import { getFieldError } from '../../lib/utils/';
import { FormWrapper } from '../FormWrapper';

export const ContactDetails: StepComponent = ({
  errors,
  entry,
  flow,
  step,
}) => {
  const { t } = useTranslation();

  const isPhoneRequired = FLOWS_WITH_REQUIRED_PHONE_NUMBER.includes(
    flow as FlowName,
  );

  return (
    <FormWrapper step={step} entry={entry} className="pt-4 md:max-w-xl">
      <input type="hidden" name="flow" value={flow} />
      <div className="flex flex-col gap-4 mb-8">
        <Errors
          errors={getFieldError('email', errors) ? [{} as ErrorType] : []}
        >
          <TextInput
            id="email"
            name="email"
            label={t('components.contact-details.form.email.label')}
            hint={t('components.contact-details.form.email.hint')}
            type="text"
            data-testid="input-email"
            error={
              getFieldError('email', errors)
                ? t('components.contact-details.form.email.error')
                : undefined
            }
            defaultValue={entry?.data?.email ?? ''}
            hasGlassBoxClass={true}
          />
        </Errors>
        <Errors
          errors={
            getFieldError('phone-number', errors) ? [{} as ErrorType] : []
          }
        >
          <TextInput
            id="phone-number"
            name="phone-number"
            label={
              isPhoneRequired
                ? t('components.contact-details.form.phone-number.label')
                : t(
                    'components.contact-details.form.phone-number.optional.label',
                  )
            }
            hint={t('components.contact-details.form.phone-number.hint')}
            type="text"
            data-testid="input-phone-number"
            error={
              getFieldError('phone-number', errors)
                ? t('components.contact-details.form.phone-number.error')
                : undefined
            }
            defaultValue={entry?.data?.['phone-number'] ?? ''}
            hasGlassBoxClass={true}
          />
        </Errors>
        <Errors
          errors={getFieldError('post-code', errors) ? [{} as ErrorType] : []}
        >
          <TextInput
            id="post-code"
            name="post-code"
            label={t('components.contact-details.form.post-code.label')}
            hint={t('components.contact-details.form.post-code.hint')}
            type="text"
            data-testid="input-post-code"
            error={
              getFieldError('post-code', errors)
                ? t('components.contact-details.form.post-code.error')
                : undefined
            }
            defaultValue={entry?.data?.['post-code'] ?? ''}
            hasGlassBoxClass={true}
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
    </FormWrapper>
  );
};
