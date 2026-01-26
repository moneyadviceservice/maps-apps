import { Errors, ErrorType } from '@maps-react/common/components/Errors';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';
import useTranslation from '@maps-react/hooks/useTranslation';

import { OptionTypesProps } from '../../types';
import { getFieldError } from '../../utils';
import { FormWrapper } from '../FormWrapper';

export const OptionTypes: OptionTypesProps = ({
  errors,
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
    <FormWrapper errors={error} className="lg:max-w-3xl">
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
