import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';
import useTranslation from '@maps-react/hooks/useTranslation';

import { StepComponent } from '../../lib/types';
import { getFieldError, hasFieldError } from '../../lib/utils';

export const EnquiryType: StepComponent = ({ errors }) => {
  const { t, tList, locale } = useTranslation();
  const options = tList('components.enquiry-type.form.flow.options');
  const errorId = 'flow-error';
  const error = getFieldError(errors, 'flow')
    ? t('components.enquiry-type.form.flow.error')
    : undefined;
  return (
    <>
      <H1 className="mb-4 text-blue-800" data-testid="enquiry-type-title">
        {t('components.enquiry-type.title')}
      </H1>
      <form action="/api/form-handler" method="POST" noValidate>
        <input type="hidden" name="lang" value={locale} />
        <Errors errors={hasFieldError(errors, 'flow')}>
          {error && (
            <Paragraph
              id={errorId}
              className="text-red-700"
              data-testid={errorId}
            >
              {error}
            </Paragraph>
          )}
          <QuestionRadioButton options={options} name="flow" />
        </Errors>
        <Button type="submit" className="mt-9" data-testid="continue-button">
          {t('common.continue')}
        </Button>
      </form>
    </>
  );
};
