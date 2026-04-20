import { useErrorSummary } from 'hooks/useErrorSummary';
import { twMerge } from 'tailwind-merge';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import { RadioButton } from '@maps-react/form/components/RadioButton';

export interface RadioInput {
  key: string;
  title?: string;
  layout?: 'row' | 'column';
  options: {
    label: string;
    value: string;
    hintText?: string;
  }[];
}

interface PageProps {
  radioInput: RadioInput;
  initialValue: string;
}

export const RadioQuestion = ({ radioInput, initialValue }: PageProps) => {
  const { fieldErrors } = useErrorSummary();
  const layout = radioInput.layout;
  const layoutClass = layout === 'row' ? 'flex-row' : 'flex-col';

  const hasError = !!fieldErrors?.[radioInput.key];

  return (
    <fieldset>
      {radioInput.title && (
        <legend className="mb-8 mt-2" data-testid={`${radioInput.key}-title`}>
          {radioInput.title}
        </legend>
      )}
      <div
        className={twMerge('flex', layoutClass, 'pl-2')}
        data-testid="flex-wrapper"
      >
        {radioInput.options.map(({ label, value, hintText }, index) => (
          <div
            key={`radio-${value}`}
            className={twMerge(
              layout === 'row' && 'mr-16',
              layout === 'column' &&
                radioInput.options.length !== index + 1 &&
                'mb-6',
            )}
          >
            <RadioButton
              key={`radio-${radioInput.key}-${value}`}
              name={radioInput.key}
              id={`radio-${radioInput.key}-${value}`}
              defaultChecked={initialValue === value}
              className={'my-0'}
              hasError={hasError}
              radioInputTestId={`radio-input-${value}`}
              aria-label={label}
              value={value}
            >
              {label}
            </RadioButton>
            {hintText && (
              <Paragraph
                id={`hint-${value}`}
                testId={`hint-${value}`}
                className={twMerge(
                  'pl-1 mb-0 ml-12 -mt-2 text-base text-gray-600',
                )}
              >
                {hintText}
              </Paragraph>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
};
