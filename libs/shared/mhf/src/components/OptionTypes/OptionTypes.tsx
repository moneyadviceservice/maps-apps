import { QuestionRadioButton } from '@maps-react/form/components/QuestionRadioButton';
import useTranslation from '@maps-react/hooks/useTranslation';

import { OptionTypesProps } from '../../types';
import { getFieldError } from '../../utils';
import { FormWrapper } from '../FormWrapper';

/**
 * Makes use of the QuestionRadioButton component to display a list of options for the user to select from.
 * Options and error message are passed in as translation keys
 * Name of the field is defaulted to 'flow' which is used to determine the next step in the flow, but can be overridden if needed (e.g. for values that are not related to the flow and just need to be captured in the store)
 * @param param0
 * @returns
 */
export const OptionTypes: OptionTypesProps = ({
  errors,
  step,
  name,
  optionsContentKey,
  formErrorContentKey,
  defaultChecked,
  nextStep,
}) => {
  const { t, tList } = useTranslation();
  const options = tList(optionsContentKey ?? '');
  const error = getFieldError(name, errors)
    ? t(formErrorContentKey ?? 'Required Field')
    : undefined;
  return (
    <FormWrapper className="lg:max-w-3xl" nextStep={nextStep}>
      <QuestionRadioButton
        options={options}
        name={name}
        error={error}
        hasErrorWrapper={true}
        hideLabel={true}
        defaultChecked={defaultChecked}
      >
        {t(`components.${step}.title`)}
      </QuestionRadioButton>
    </FormWrapper>
  );
};
