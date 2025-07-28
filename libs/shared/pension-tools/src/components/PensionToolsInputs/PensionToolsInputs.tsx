import { ChangeEvent, ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

import { Errors } from '@maps-react/common/components/Errors';
import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { NumberInput } from '@maps-react/form/components/NumberInput';
import { ErrorObject, Question } from '@maps-react/form/types';
import useTranslation from '@maps-react/hooks/useTranslation';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { addUnitToAriaLabel } from '../../utils/addUnitToAriaLabel';
import { isInputAllowedDefault } from '../../utils/inputValidation';

export type PensionToolsInputsProps = {
  field: Question;
  errors: ErrorObject;
  queryData: DataFromQuery;
  isAllowed: (value: { floatValue: number | undefined }) => boolean;
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>, field: Question) => void;
};

export const PensionToolsInputs = ({
  field,
  errors,
  queryData,
  onChange,
  isAllowed,
  value,
}: PensionToolsInputsProps) => {
  const { z } = useTranslation();

  const getErrorMessage = (field: Question, errors: ErrorObject) => {
    const HTMLvariant = (field.errors as Record<string, ReactNode>)[
      `${errors[field.type].type}HTML`
    ];
    if (HTMLvariant) {
      return HTMLvariant;
    }
    return (field.errors as Record<string, string>)[errors[field.type].type];
  };

  const hasError =
    field?.errors &&
    errors[field?.type] &&
    (field?.errors as Record<string, string>)[errors[field?.type]?.type];

  const hasRequired =
    field?.errors &&
    (field?.errors as Record<string, string>)['required'] !== undefined;

  return (
    <Errors
      errors={hasError ? ['error'] : []}
      className={twMerge(hasError ? 'pl-4' : '')}
    >
      <fieldset className="mb-4">
        <label
          htmlFor={field.type}
          className={twMerge(
            'text-2xl font-medium text-gray-800 inline-flex mb-2',
            !!field.description && 'mb-0',
          )}
        >
          {field.title}
        </label>
        {field.description}
        {hasError && field?.errors && (
          <div className="mb-2 text-red-700" aria-describedby={field.type}>
            {getErrorMessage(field, errors)}
          </div>
        )}
        {field.type === 'age' && (
          <div className="flex">
            <NumberInput
              data-testid={field.type}
              aria-required={hasRequired || undefined}
              id={field.type}
              key={field.type}
              name={field.type}
              className="border-gray-600 border-r-0 h-[49px] ml-0 max-w-[307px]"
              value={queryData[field.type]}
              onChange={(e) => {
                onChange && onChange(e, field);
              }}
              aria-label={addUnitToAriaLabel(field.title, 'years', z)}
            />
            <span
              aria-hidden
              className="bg-gray-100 py-2 px-3.5 rounded-r border-gray-400 border border-solid min-w-[92px] mr-2 flex items-center"
            >
              {z({
                en: 'Years',
                cy: 'flynedd',
              })}
            </span>
          </div>
        )}
        {field.type !== 'age' && (
          <MoneyInput
            data-testid={field.type}
            aria-required={hasRequired || undefined}
            id={field.type}
            key={field.type}
            name={field.type}
            className="mr-2 border-gray-600 border-l-0 max-w-[360px]"
            isAllowed={({ floatValue }) =>
              isAllowed({ floatValue }) && isInputAllowedDefault({ floatValue })
            }
            value={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              onChange && onChange(e, field);
            }}
            aria-label={addUnitToAriaLabel(field.title, 'pounds', z)}
          />
        )}
      </fieldset>
    </Errors>
  );
};
