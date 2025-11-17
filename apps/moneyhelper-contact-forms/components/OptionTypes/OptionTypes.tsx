import { twMerge } from 'tailwind-merge';

import { Errors, ErrorType } from '@maps-react/common/components/Errors';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';
import useTranslation from '@maps-react/hooks/useTranslation';

import { OptionTypesProps } from '../../lib/types';
import { getFieldError } from '../../lib/utils';
import { FormWrapper } from '../FormWrapper';

export const OptionTypes: OptionTypesProps = ({
  errors,
  step,
  optionsContentKey,
  formErrorContentKey,
}) => {
  const { t, tList } = useTranslation();
  const options = tList(optionsContentKey ?? '');
  const errorId = 'flow-error';
  const error = getFieldError('flow', errors)
    ? t(formErrorContentKey ?? 'Required Field')
    : undefined;
  return (
    <FormWrapper
      step={step}
      className={twMerge('md:max-w-xl', error ? 'pt-4' : 'pt-1')}
    >
      <Errors errors={error ? [{} as ErrorType] : []}>
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
    </FormWrapper>
  );
};
