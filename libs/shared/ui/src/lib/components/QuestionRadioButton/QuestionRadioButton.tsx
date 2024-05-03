import { ChangeEvent } from 'react';
import { RadioButton } from '../../components/RadioButton';

export type QuestionRadioButtonProps = {
  children?: string;
  options: QuestionOption[];
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  defaultChecked?: string;
  testId?: string;
};

export interface QuestionOption {
  text: string;
  value: string;
}

export const QuestionRadioButton = ({
  options,
  children,
  onChange,
  name,
  defaultChecked,
  testId = 'question-radio',
}: QuestionRadioButtonProps) => {
  return (
    <div data-testid={testId}>
      {children ? (
        <legend className="mb-2 text-lg text-gray-800 font-bold">
          {children}
        </legend>
      ) : null}
      {options.map(({ text, value }, index) => {
        return (
          <div key={name + value} className="mt-3">
            <RadioButton
              defaultChecked={defaultChecked === value}
              required
              onChange={onChange}
              name={name}
              value={value}
              id={name + '-' + index}
            >
              {text}
            </RadioButton>
          </div>
        );
      })}
    </div>
  );
};
