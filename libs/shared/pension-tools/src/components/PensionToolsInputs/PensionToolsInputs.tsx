import { ChangeEvent } from 'react';

import { twMerge } from 'tailwind-merge';

import { Errors } from '@maps-react/common/components/Errors';
import { AffixInput } from '@maps-react/form/components/AffixInput';
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

  const getErrorMessage = (
    field: Question,
    errors: ErrorObject,
  ): string | undefined => {
    return hasError ? field.errors?.[errors[field.type].type] : undefined;
  };

  const hasError =
    errors[field.type] && field.errors?.[errors[field.type].type];

  const hasRequired = field.errors?.['required'] !== undefined;

  const error = hasError && getErrorMessage(field, errors);

  const ageInputHintId = `${field.type}-hint`;
  const ageInputErrorId = `${field.type}-error`;

  const ageInputDescribedBy =
    [field.description && ageInputHintId, hasError && ageInputErrorId]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <Errors
      errors={hasError ? ['error'] : []}
      className={twMerge(hasError ? 'pl-4' : '')}
    >
      <fieldset className="mb-4">
        {field.type === 'age' ? (
          <>
            <label
              htmlFor={field.type}
              className={twMerge(
                'text-2xl block mb-2',
                !!field.description && 'mb-0',
              )}
            >
              {field.title}
            </label>

            {field.description && (
              <div id={ageInputHintId} className={'mb-2 text-gray-650'}>
                {field.description}
              </div>
            )}

            {hasError && field?.errors && (
              <div
                id={ageInputErrorId}
                data-testid="error-label"
                className="mb-2 text-red-500"
              >
                {getErrorMessage(field, errors)}
              </div>
            )}
            <div className="flex">
              <NumberInput
                data-testid={field.type}
                aria-required={hasRequired || undefined}
                id={field.type}
                key={field.type}
                name={field.type}
                className="border-gray-600 border-r-0 h-[49px] ml-0 max-w-[307px] grow"
                value={queryData[field.type]}
                onChange={(e) => {
                  onChange?.(e, field);
                }}
                aria-label={addUnitToAriaLabel(field.title, 'years', z)}
                aria-describedby={ageInputDescribedBy}
              />
              <span
                aria-hidden
                className="bg-gray-100 py-2 px-3.5 rounded-r border-gray-400 border border-solid mr-2 flex items-center"
              >
                {z({
                  en: 'Years old',
                  cy: 'flynedd',
                })}
              </span>
            </div>
          </>
        ) : (
          <AffixInput
            variant="money"
            data-testid={field.type}
            id={field.type}
            key={field.type}
            name={field.type}
            label={field.title}
            labelClassName={twMerge(!field.description && 'mb-2')}
            hint={field.description}
            hintClassName="mb-2"
            inputClassName="mr-2 max-w-[360px]"
            hasError={!!hasError}
            error={error}
            isAllowed={({ floatValue }) =>
              isAllowed({ floatValue }) && isInputAllowedDefault({ floatValue })
            }
            value={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              onChange?.(e, field);
            }}
            aria-required={hasRequired || undefined}
            aria-label={addUnitToAriaLabel(field.title, 'pounds', z)}
          />
        )}
      </fieldset>
    </Errors>
  );
};
