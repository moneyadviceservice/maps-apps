import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';
import useTranslation from '@maps-react/hooks/useTranslation';

import { OptionTypesProps } from '../../types';
import { getFieldError } from '../../utils';
import { FormWrapper } from '../FormWrapper';

export const OptionTypes: OptionTypesProps = ({
  errors,
  step,
  optionsContentKey,
  formErrorContentKey,
}) => {
  const { t, tList } = useTranslation();
  const options = tList(optionsContentKey ?? '');
  const error = getFieldError('flow', errors)
    ? t(formErrorContentKey ?? 'Required Field')
    : undefined;
  return (
    <FormWrapper className="lg:max-w-3xl">
      <QuestionRadioButton
        options={options}
        name="flow"
        error={error}
        hasErrorWrapper={true}
        hideLabel={true}
      >
        {t(`components.${step}.title`)}
      </QuestionRadioButton>
    </FormWrapper>
  );
};
