import React from 'react';

import { VisibleSection } from 'components/VisibleSection';
import { getErrorMessageByKey, hasFieldError } from 'lib/validation/partner';

import { Errors } from '@maps-react/common/components/Errors';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { TextInput } from '@maps-react/form/components/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';

type EmailInputFieldProps = {
  emailValue?: string;
  formErrors: Record<string, string> | null;
  onChange: (value: string) => void;
};

const EmailInputField: React.FC<EmailInputFieldProps> = ({
  emailValue,
  formErrors,
  onChange,
}) => {
  const { t } = useTranslation();
  const fieldKey = `email`;

  const hasError = getErrorMessageByKey(fieldKey, formErrors);
  const errorMessage = t(`saveAndComeBack.errors.${hasError}`);
  const hint = hasError ? `email-error` : '';

  return (
    <section className="mb-6">
      <Errors errors={hasFieldError(fieldKey, formErrors)}>
        <label className="block mb-1 text-lg" htmlFor={`email`}>
          {t('saveAndComeBack.userEmailLabelText')}
        </label>
        <Paragraph id={`email-hint`} className="mb-1 text-gray-650">
          {t('saveAndComeBack.emailHint')}
        </Paragraph>
        <VisibleSection visible={!!hasError}>
          <Paragraph id={`email-error`} className="mb-1 text-red-700">
            {errorMessage || t('saveAndComeBack.errors.email-error')}
          </Paragraph>
        </VisibleSection>

        <TextInput
          className={`px-3 m-px mt-1 w-full h-10 rounded border focus:outline-none focus:shadow-focus-outline md:w-80 obfuscate ${
            hasError ? 'border-red-700' : ''
          }`}
          id={`email`}
          name={fieldKey}
          type="email"
          aria-describedby={`email-hint ${hint}`}
          defaultValue={emailValue || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </Errors>
    </section>
  );
};

export default EmailInputField;
