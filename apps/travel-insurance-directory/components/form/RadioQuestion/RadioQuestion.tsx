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
  initialValue?: string;
  legendClassName?: string;
  gap?: string;
  displayErrorState?: boolean;
  useFieldset?: boolean;
  testId?: string;
}

export const RadioQuestion = ({
  radioInput,
  initialValue,
  legendClassName,
  gap,
  displayErrorState,
  useFieldset = true,
  testId,
}: PageProps) => {
  const { fieldErrors } = useErrorSummary();
  const layout = radioInput.layout;
  const layoutClass = layout === 'row' ? 'flex-row' : 'flex-col';

  const hasError = !!(fieldErrors?.[radioInput.key] || displayErrorState);

  const content = (
    <>
      {radioInput.title && useFieldset && (
        <legend
          className={twMerge('mb-8 mt-2', legendClassName)}
          data-testid={`${radioInput.key}-title`}
        >
          {radioInput.title}
        </legend>
      )}
      <div className={twMerge('flex', layoutClass)} data-testid="flex-wrapper">
        {radioInput.options.map(({ label, value, hintText }, index) => (
          <div
            key={`radio-${value}`}
            className={twMerge(
              layout === 'row' && `${gap ?? 'mr-16'}`,
              layout === 'column' &&
                radioInput.options.length !== index + 1 &&
                'mb-6',
            )}
          >
            <RadioButton
              key={`radio-${radioInput.key}-${value}`}
              name={radioInput.key}
              id={`radio-${radioInput.key}-${value}`}
              data-testid={
                testId ? `radio-${testId}-${value}` : `radio-input-${value}`
              }
              testId={testId && `${testId}_${value}`}
              defaultChecked={initialValue === value}
              className={'my-0'}
              hasError={hasError}
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
    </>
  );

  // If useFieldset is false, wrap in a radiogroup div for accessibility
  if (!useFieldset) {
    return (
      <div
        role="radiogroup"
        aria-label={radioInput.title ?? 'AM or PM selection'}
      >
        {content}
      </div>
    );
  }

  return <fieldset>{content}</fieldset>;
};
