import { Errors } from '@maps-react/common/components/Errors';
import { H1 } from '@maps-react/common/components/Heading';
import { TextInput } from '@maps-react/form/components/TextInput';
import useTranslation from '@maps-react/hooks/useTranslation';

import { StepComponent } from '../../lib/types';
import { getFieldError, hasFieldError } from '../../lib/utils/';
import { FormWrapper } from '../FormWrapper';

export const Name: StepComponent = ({ errors, entry, step }) => {
  const { t } = useTranslation();

  return (
    <>
      <H1 className="mb-4 text-blue-800" data-testid="name-title">
        {t('components.name.title')}
      </H1>
      <FormWrapper step={step}>
        <div className="mb-6">
          <Errors errors={hasFieldError(errors, 'first-name')}>
            <TextInput
              id="first-name"
              name="first-name"
              label={t('components.name.form.first-name.label')}
              type="text"
              data-testid="input-first-name"
              error={
                getFieldError(errors, 'first-name')
                  ? t('components.name.form.first-name.error')
                  : undefined
              }
              defaultValue={entry?.data?.['first-name'] ?? ''}
              hasGlassBoxClass={true}
            />
          </Errors>
        </div>
        <div className="mb-9">
          <Errors errors={hasFieldError(errors, 'last-name')}>
            <TextInput
              id="last-name"
              name="last-name"
              label={t('components.name.form.last-name.label')}
              type="text"
              data-testid="input-last-name"
              error={
                getFieldError(errors, 'last-name')
                  ? t('components.name.form.last-name.error')
                  : undefined
              }
              defaultValue={entry?.data?.['last-name'] ?? ''}
              hasGlassBoxClass={true}
            />
          </Errors>
        </div>
      </FormWrapper>
    </>
  );
};
