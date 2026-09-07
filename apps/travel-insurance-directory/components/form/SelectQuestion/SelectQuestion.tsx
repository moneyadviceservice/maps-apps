import { useErrorSummary } from 'hooks/useErrorSummary';
import { twMerge } from 'tailwind-merge';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Select } from '@maps-react/form/components/Select/Select';

export interface SelectInput {
  key: string;
  title?: string;
  layout?: 'row' | 'column';
  options: {
    text: string;
    value: string;
  }[];
  hintText?: string;
}

interface PageProps {
  selectInput: SelectInput;
  initialValue: string;
}

export const SelectQuestion = ({ selectInput, initialValue }: PageProps) => {
  const { fieldErrors } = useErrorSummary();

  const hasError = !!fieldErrors?.[selectInput.key];

  return (
    <fieldset>
      {selectInput.title && (
        <legend className="mb-8" data-testid={`${selectInput.key}-title`}>
          {selectInput.title}
        </legend>
      )}
      <Select
        key={`select-${selectInput.key}`}
        name={selectInput.key}
        id={`select-${selectInput.key}`}
        className={'my-0 max-w-96'}
        hasError={hasError}
        data-testid={`select-input-${selectInput.key}`}
        aria-label={selectInput.title}
        emptyItemText={'Select an option'}
        defaultValue={initialValue}
        options={selectInput.options.map(({ text, value }) => ({
          text,
          value,
        }))}
      />
      {selectInput?.hintText && (
        <Paragraph
          id={`select-hint-${selectInput.key}`}
          testId={`select-hint-${selectInput.key}`}
          className={twMerge('pl-1 mb-0 ml-12 -mt-2 text-base text-gray-600')}
        >
          {selectInput.hintText}
        </Paragraph>
      )}
    </fieldset>
  );
};
