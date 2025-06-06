import { v4 } from 'uuid';

import { RadioButton } from '@maps-react/form/components/RadioButton';

type Props = {
  legend: string;
  fieldName: string;
  options: { label: string; value: string }[];
  defaultValue?: string;
};

export const RadioSelect = ({
  legend,
  fieldName,
  options,
  defaultValue,
}: Props) => (
  <fieldset className="mt-4">
    <legend className="sr-only">{legend}</legend>
    <div className="space-y-6">
      {options.map(({ label, value }) => (
        <RadioButton
          key={v4()}
          name={fieldName}
          value={value}
          id={`fieldName-${value}`}
          defaultChecked={defaultValue === value}
          className={'mr-4'}
        >
          {label}
        </RadioButton>
      ))}
    </div>
  </fieldset>
);
