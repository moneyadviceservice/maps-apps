import { FieldError } from 'components/form/FieldError';

import { TextInput } from '@maps-react/form/components/TextInput';

interface FormInputConfig {
  key: string;
  title: string;
  type: string;
  defaultValue?: string | null;
}

interface TextInputGroupProps {
  inputs: FormInputConfig[];
}

export const TextInputGroup = ({ inputs }: TextInputGroupProps) => {
  return (
    <>
      {inputs.map((input) => (
        <FieldError fieldKey={input.key} className="mt-8" key={input.key}>
          <TextInput
            label={input.title}
            type={input.type}
            name={input.key}
            id={input.key}
            data-testid={input.key}
            className="max-w-96"
            defaultValue={input.defaultValue ?? ''}
          />
        </FieldError>
      ))}
    </>
  );
};
