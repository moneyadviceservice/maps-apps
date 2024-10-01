import { ReactNode, useEffect, useMemo, useState } from 'react';
import { MoneyInput } from 'components/MoneyInput';
import { Errors as ErrorType } from 'pages/[language]/baby-cost-calculator';
import { Errors } from '@maps-react/common/components/Errors';
import {
  FormField,
  FormData,
  ConditionalFields,
  FieldCondition,
  GroupType,
} from 'data/types';
import { Select } from 'components/Select';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { groupFormFields } from 'utils/TabToolUtils';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { RadioButton } from '@maps-react/form/components/RadioButton';
import { checkFieldCondition } from 'utils/StepToolUtils/checkFieldCondition';
import { GroupContainer } from 'components/GroupContainer';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type RenderFieldComponentProps = {
  field: FormField;
  keyPrefix: string;
  formErrors: ErrorType;
  renderField: (field: FormField, hasErrors?: boolean) => React.ReactNode;
  isNested?: boolean;
};

const RenderFieldComponent = ({
  field,
  keyPrefix,
  formErrors,
  renderField,
  isNested,
}: RenderFieldComponentProps) => {
  const { key, label, description, type, expandableContent, topMargin } = field;

  const hasErrors = !!formErrors?.[`${key}`];

  const fieldWidth = type === 'select' ? 'md:w-72' : 'md:w-96';

  return (
    <div
      key={`${key}`}
      className={`mb-4 ${topMargin && 'border-t border-gray-300 pt-4'}`}
    >
      <Errors
        errors={formErrors?.[`${key}`] ?? []}
        testId={`field-group-${key}`}
      >
        <label
          htmlFor={`${keyPrefix}${key}`}
          className={`block text-xl ${fieldWidth}`}
        >
          {label}
        </label>
        {description && (
          <span className={`block text-gray-400 ${fieldWidth}`}>
            {description}
          </span>
        )}
        {formErrors?.[`${key}`] && (
          <div className="text-red-700" aria-describedby={`${keyPrefix}${key}`}>
            {formErrors?.[key]?.[0] !== '' ? `${formErrors?.[key]}` : ''}
          </div>
        )}
        <div className={`${fieldWidth} mt-2`}>
          {renderField(field, hasErrors)}
        </div>
      </Errors>
      {expandableContent && (
        <ExpandableSection
          title={expandableContent.title}
          variant="hyperlink"
          testClassName={`mt-2 ${fieldWidth}`}
          contentTestClassName={`${fieldWidth}`}
          type={isNested ? 'nested' : undefined}
        >
          {expandableContent.text}
        </ExpandableSection>
      )}
    </div>
  );
};

type DynamicFieldProps = {
  formFields: FormField[];
  formErrors: ErrorType;
  savedData?: FormData;
  keyPrefix?: string;
  hiddenFields?: ReactNode;
  conditionalFields?: ConditionalFields;
  updateSavedValues?: (key: string, value: string) => void;
};

export const DynamicFields = ({
  formFields,
  formErrors,
  savedData,
  keyPrefix = 'q-',
  hiddenFields,
  conditionalFields,
  updateSavedValues,
}: DynamicFieldProps) => {
  const { z } = useTranslation();
  const [hash, setHash] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHash(window.location.hash);
    }
  }, []);

  const renderSelect = ({
    key,
    label,
    defaultSelectValue,
    options,
  }: FormField) =>
    options && (
      <Select
        data-testid={key}
        id={`${keyPrefix}${key}`}
        name={`${keyPrefix}${key}`}
        defaultValue={savedData?.[`${key}`] || defaultSelectValue}
        options={options}
        emptyItemText={z({
          en: 'Select an option',
          cy: 'Dewiswch opsiwn',
        })}
        aria-label={label}
        onChange={(e) =>
          updateSavedValues && updateSavedValues(key, e.target.value)
        }
        selectClassName="h-[49px]"
      />
    );

  const renderInputCurrency = (
    { key, label, defaultInputValue, addon }: FormField,
    hasErrors?: boolean,
  ) => {
    return (
      <MoneyInput
        data-testid={key}
        id={`${keyPrefix}${key}`}
        name={`${keyPrefix}${key}`}
        inputMode="numeric"
        type="text"
        defaultValue={
          savedData?.[`${key}`]
            ? Number(savedData?.[`${key}`]).toFixed(2)
            : Number(defaultInputValue).toFixed(2)
        }
        decimalSeparator="."
        decimalScale={2}
        isAllowed={({ floatValue }) =>
          (floatValue ?? 0) >= 0 && (floatValue ?? 0) <= 999999999
        }
        aria-label={label}
        onChange={(e) =>
          updateSavedValues && updateSavedValues(key, e.target.value)
        }
        addon={addon}
        inputClassName={hasErrors ? 'border rounded border-red-700' : ''}
      />
    );
  };

  const renderInputCurrencyWithSelect = (field: FormField) => (
    <div className="grid grid-cols-2 gap-4" role="group">
      {renderInputCurrency({
        ...field,
        key: `${field.key}-i`,
      } as FormField)}
      {renderSelect({
        ...field,
        key: `${field.key}-s`,
      } as FormField)}
    </div>
  );

  const renderRadio = ({ key, defaultRadioValue, options }: FormField) => {
    return (
      <div className="flex flex-row pt-2">
        {options?.map(({ text, value }) => (
          <div className="mr-6" key={text}>
            <RadioButton
              data-testid={`${key}-${value}`}
              id={`${keyPrefix}${key}-${value}`}
              name={`${keyPrefix}${key}`}
              defaultChecked={
                savedData?.[`${key}`]
                  ? savedData?.[`${key}`] === value
                  : defaultRadioValue === value
              }
              value={value}
              aria-label={text}
              onChange={(e) =>
                conditionalFields?.has(key) &&
                updateSavedValues &&
                updateSavedValues(key, e.target.value)
              }
            >
              {text}
            </RadioButton>
          </div>
        ))}
      </div>
    );
  };

  const renderField = (field: FormField, hasErrors?: boolean) => {
    const { type } = field;

    switch (type) {
      case 'select':
        return renderSelect(field);
      case 'input-currency':
        return renderInputCurrency(field, hasErrors);
      case 'input-currency-with-select':
        return renderInputCurrencyWithSelect(field);
      case 'radio':
        return renderRadio(field);
      default:
        return null;
    }
  };

  const groupedFields = useMemo(
    () => groupFormFields(formFields),
    [formFields],
  );

  const shouldRenderField = (fieldCondition?: FieldCondition) =>
    !fieldCondition ||
    (fieldCondition &&
      conditionalFields?.has(fieldCondition?.field) &&
      checkFieldCondition(fieldCondition, savedData));

  return (
    <>
      {hiddenFields}
      {Object.keys(groupedFields).map((groupKey, i) =>
        groupKey !== 'no-group' ? (
          <GroupContainer
            key={groupKey}
            component={
              groupedFields[groupKey][0].group?.type ?? GroupType.EXPANDABLE
            }
            title={groupedFields[groupKey][0].group?.label ?? ''}
            groupKey={groupKey}
            open={hash ? hash === `#${groupKey}` : i === 0}
          >
            {groupedFields[groupKey][0].group?.text && (
              <Paragraph className="mb-4 -mt-4">
                {groupedFields[groupKey][0].group?.text}
              </Paragraph>
            )}
            {groupedFields[groupKey].map(
              (field) =>
                shouldRenderField(field.fieldCondition) && (
                  <RenderFieldComponent
                    key={field.key}
                    field={field}
                    keyPrefix={keyPrefix}
                    formErrors={formErrors}
                    renderField={renderField}
                    isNested={true}
                  />
                ),
            )}
          </GroupContainer>
        ) : (
          groupedFields[groupKey].map(
            (field) =>
              shouldRenderField(field.fieldCondition) && (
                <RenderFieldComponent
                  key={field.key}
                  field={field}
                  keyPrefix={keyPrefix}
                  formErrors={formErrors}
                  renderField={renderField}
                />
              ),
          )
        ),
      )}
    </>
  );
};
