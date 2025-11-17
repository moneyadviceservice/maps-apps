import { ChangeEvent, KeyboardEvent } from 'react';

import { Errors } from '@maps-react/common/components/Errors';
import { DateInput } from '@maps-react/form/components/DateInput';
import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { Select } from '@maps-react/form/components/Select';
import useTranslation from '@maps-react/hooks/useTranslation';

import { DateFieldErrors as FieldValidation } from '../../utils/validation/types';
import {
  CalculatorConfig,
  CalculatorField,
  PropertyTaxCalculatorInput,
  PropertyTaxCalculatorResult,
} from './types';

type TranslationFunction = ReturnType<typeof useTranslation>['z'];

/**
 * Get the label text for a field, handling both static strings and function labels
 */
export const getFieldLabel = (
  field: CalculatorField,
  z: TranslationFunction,
): string => (typeof field.label === 'function' ? field.label(z) : field.label);

/**
 * Get the hint text for a field, handling both static strings and function hints
 */
export const getFieldHintText = (
  field: CalculatorField,
  z: TranslationFunction,
): string | undefined => {
  if (!field.hint) return undefined;
  return typeof field.hint === 'function' ? field.hint(z) : field.hint;
};

/**
 * Get the options for a select field, using custom field options if available
 */
export const getFieldOptions = (
  field: CalculatorField,
  config: CalculatorConfig<
    PropertyTaxCalculatorInput,
    PropertyTaxCalculatorResult
  >,
  z: TranslationFunction,
): Array<{ value: string; text: string }> | undefined => {
  if (field.type === 'select' && config.fieldOptions?.[field.name]) {
    return config.fieldOptions[field.name](z);
  }
  return field.options;
};

/**
 * Get date field errors for specific date input fields (day, month, year)
 */
export const getDateFieldErrors = (
  field: CalculatorField,
  hasErrors: boolean,
  fieldSpecificErrors?: {
    [key: string]: FieldValidation | undefined;
  },
): FieldValidation | undefined => {
  if (!hasErrors) return undefined;
  return (
    fieldSpecificErrors?.[field.name] || {
      day: true,
      month: true,
      year: true,
    }
  );
};

export interface RenderFieldParams {
  field: CalculatorField;
  errors: Record<string, string[]>;
  fieldSpecificErrors?: {
    [key: string]: FieldValidation | undefined;
  };
  values: PropertyTaxCalculatorInput;
  config: CalculatorConfig<
    PropertyTaxCalculatorInput,
    PropertyTaxCalculatorResult
  >;
  z: TranslationFunction;
  fireToolStartEvent: () => void;
  handleToolInteractionEvent: (
    event:
      | KeyboardEvent<HTMLInputElement>
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>,
    reactCompType: string,
    fieldName: string,
  ) => void;
}

/**
 * Renders a calculator field based on its type (select, money, date)
 * This is extracted as a pure function to enable easier testing
 */
export const renderField = ({
  field,
  errors,
  fieldSpecificErrors,
  values,
  config,
  z,
  fireToolStartEvent,
  handleToolInteractionEvent,
}: RenderFieldParams) => {
  const fieldErrors = errors[field.name] || [];
  const errorId = `${field.name}Error`;
  const fieldOptions = getFieldOptions(field, config, z);
  const fieldLabel = getFieldLabel(field, z);
  const hasErrors = fieldErrors.length > 0;

  return (
    <div key={field.name} className="mb-6" id={`${field.name}Id`}>
      <Errors errors={fieldErrors}>
        <label
          htmlFor={field.name}
          className="block text-2xl font-medium text-gray-800 "
        >
          {fieldLabel}
        </label>

        {fieldErrors.map((e) => (
          <div key={e} id={errorId}>
            <span className="sr-only">Error: </span>
            <div className="block mb-2 text-red-700">{e}</div>
          </div>
        ))}

        {field.type === 'select' && (fieldOptions || field.options) && (
          <div className="mt-2">
            <Select
              id={field.name}
              name={field.name}
              hidePlaceholder={true}
              defaultValue={
                values[field.name as keyof PropertyTaxCalculatorInput]
              }
              options={fieldOptions || field.options || []}
              aria-describedby={hasErrors ? errorId : ''}
              onChange={(e) => {
                fireToolStartEvent();
                handleToolInteractionEvent(e, 'Select', field.name);
              }}
            />
          </div>
        )}

        {field.type === 'money' && (
          <div className="mt-2">
            <MoneyInput
              id={field.name}
              name={field.name}
              defaultValue={
                values[field.name as keyof PropertyTaxCalculatorInput] ?? ''
              }
              aria-describedby={hasErrors ? errorId : ''}
              inputClassName="w-full"
              onChange={(e) => {
                fireToolStartEvent();
                handleToolInteractionEvent(e, 'MoneyInput', field.name);
              }}
              onKeyDown={(e) => {
                handleToolInteractionEvent(e, 'MoneyInput', field.name);
              }}
            />
          </div>
        )}

        {field.type === 'date' && (
          <div className="flex flex-col gap-2">
            <DateInput
              showDayField={true}
              defaultValues={
                values[field.name as keyof PropertyTaxCalculatorInput] ?? ''
              }
              fieldErrors={getDateFieldErrors(
                field,
                hasErrors,
                fieldSpecificErrors,
              )}
              legend={fieldLabel}
              hintText={getFieldHintText(field, z)}
            />
          </div>
        )}
      </Errors>
    </div>
  );
};
