import React, { useEffect, useState } from 'react';

import { checkboxStyles, radioStyles } from 'components/RichTextWrapper';
import {
  debtAdvice,
  FormFlowType,
  membershipBodyOpt,
  orgAddressQuestions,
  orgFcaReg,
  orgFcaRegNumber,
  orgGeoRegions,
  orgLaunchDate,
  orgLive,
  orgSoftware,
  orgType,
  orgUse,
  QuestionOrg,
  SIGN_UP_PART_1_ID,
} from 'data/form-data/org_signup';
import { Entry } from 'lib/types';
import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { H2, H3 } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { CheckboxGroup } from '@maps-react/form/components/Checkbox';
import { RadioButton } from '@maps-react/form/components/RadioButton';
import { Options, Select } from '@maps-react/form/components/Select';
import { TextInput } from '@maps-react/form/components/TextInput';
import { Answer } from '@maps-react/form/types';
import useTranslation from '@maps-react/hooks/useTranslation';

type HasError = { field: string; type: string } | undefined;

const SignUpOrg = ({
  entry,
  lang,
  onSubmit,
  inputIdPrefix,
}: {
  entry: Entry;
  lang: string;
  onSubmit: React.SubmitEventHandler<HTMLFormElement>;
  inputIdPrefix: string;
}) => {
  const { z } = useTranslation();

  const inputs = [
    ...orgAddressQuestions(z),
    orgType(z),
    orgGeoRegions(z),
    orgUse(z),
    debtAdvice(z),
    orgLive(z),
    orgLaunchDate(z),
    orgSoftware(z),
  ];

  return (
    <>
      <H2 className="my-8 md:text-5xl" id={SIGN_UP_PART_1_ID}>
        {z({
          en: 'Part 1 - Register your organisation',
          cy: 'Rhan 1 - Cofrestru eich sefydliad',
        })}
      </H2>
      <form
        action="/fn/form-handler"
        method="POST"
        onSubmit={onSubmit}
        noValidate
      >
        <input type="hidden" name="lang" value={lang} />
        <input type="hidden" name="flow" value={FormFlowType.NEW_ORG} />
        {inputs.map((input) => {
          return (
            <div key={input.name}>
              {input.name === 'organisationUse' && (
                <H3 className="mb-8 text-5xl">
                  {z({
                    en: 'How your organisation uses the SFS',
                    cy: "Sut mae eich sefydliad yn defnyddio'r SFS",
                  })}
                </H3>
              )}
              <Input
                entry={entry}
                input={input}
                idPrefix={inputIdPrefix}
              ></Input>
            </div>
          );
        })}
        <H3 className="mb-8 text-4xl">
          {z({
            en: 'Memberships',
            cy: 'Aelodaeth',
          })}
        </H3>
        <OrganisationFCA entry={entry} idPrefix={inputIdPrefix} />
        <Memberships entry={entry} idPrefix={inputIdPrefix} />
        <Button
          className="text-blue-600 bg-green-300 hover:text-blue-600 active:text-blue-600 hover:bg-green-500 active:bg-green-500 active:outline-blue-600"
          data-testid="signupOrg"
        >
          {z({
            en: 'Next',
            cy: 'Nesaf',
          })}
        </Button>
      </form>
    </>
  );
};

const OrganisationFCA = ({
  entry,
  idPrefix,
}: {
  entry: Entry;
  idPrefix: string;
}) => {
  const { z } = useTranslation();
  const { data, errors } = entry;
  const input = orgFcaReg(z);
  const inputText = orgFcaRegNumber(z);
  const [radioSelected, setRadioSelected] = useState(data?.fcaReg ?? '');
  const inputId = `${idPrefix}${input.name}`;
  const errorMessageId = `${inputId}-error`;
  const hasError = errors?.find((error) => error.field === input.name) as
    | { field: string; type: string }
    | undefined;

  const hasTextError = errors?.find(
    (error) => error.field === inputText.name,
  ) as HasError;

  useEffect(() => {
    setRadioSelected(data?.fcaReg ?? '');
  }, [data]);

  return (
    <>
      <Errors errors={hasError ? ['error'] : []} key={input.name}>
        <fieldset
          className="mb-8"
          id={inputId}
          tabIndex={-1}
          role="radiogroup"
          aria-describedby={hasError && errorMessageId}
          aria-invalid={!!hasError || undefined}
        >
          <legend className="block mb-4 text-2xl">{input.title}</legend>
          {hasError && input?.errors && (
            <div
              className="text-red-500 text-[18px] mb-4 -mt-2"
              id={errorMessageId}
            >
              {input?.errors[hasError?.type]}
            </div>
          )}
          <InputRadios
            input={input}
            inputId={inputId}
            radioSelected={radioSelected}
            hasError={hasError}
            errorMessageId={errorMessageId}
            setRadioSelected={setRadioSelected}
          />
        </fieldset>
      </Errors>
      {radioSelected === 'fca-yes' && (
        <Errors errors={hasTextError ? ['error'] : []} key={inputText.name}>
          <div className="max-w-sm mb-8">
            <label htmlFor={inputText.name} className="block mb-2 text-2xl">
              {inputText.title}
            </label>
            <TextInput
              name={inputText.name}
              id={`${idPrefix}${inputText.name}`}
              defaultValue={data?.fcaRegNumber ?? ''}
              className={hasTextError ? '' : 'border-gray-650'}
              error={
                hasTextError
                  ? inputText?.errors?.[hasTextError?.type]
                  : undefined
              }
            />
          </div>
        </Errors>
      )}
    </>
  );
};

const Memberships = ({
  entry,
  idPrefix,
}: {
  entry: Entry;
  idPrefix: string;
}) => {
  const { z } = useTranslation();
  const input = membershipBodyOpt(z);
  const { errors } = entry;

  const hasError = errors?.find((error) => error.field.includes(input.name));
  const inputHasError = hasError && input?.errors;

  const inputId = `${idPrefix}${input.name}`;
  const errorId = `${inputId}-error`;

  const mid = Math.ceil(input.answers.length / 2);
  const leftColumn = input.answers.slice(0, mid);
  const rightColumn = input.answers.slice(mid);

  const [selected, setSelected] = useState<string[]>(
    entry.data?.memberships || [],
  );

  const handleCheckboxChange = (value: string, checkedState: boolean) => {
    if (value === 'other' && checkedState) {
      setSelected(['other']);
    } else if (value === 'other' && !checkedState) {
      setSelected([]);
    } else {
      setSelected((prev) => {
        const updated = checkedState
          ? [...prev.filter((v) => v !== 'other'), value]
          : prev.filter((v) => v !== value);
        return updated;
      });
    }
  };

  return (
    <Errors errors={hasError ? ['error'] : []} key={input.title}>
      <fieldset
        className="max-w-2xl mb-8"
        id={inputId}
        tabIndex={-1}
        aria-describedby={hasError ? errorId : undefined}
      >
        <legend className="block mb-4 text-2xl" id={input.name}>
          {input.title}
        </legend>
        {hasError && input?.errors && (
          <div className="text-red-500 text-[18px] mb-2 -mt-1" id={errorId}>
            {input?.errors[hasError.type]}
          </div>
        )}
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex flex-col flex-1 gap-4">
            {leftColumn.map((i, index) => (
              <MembershipsCheckbox
                answer={i}
                entry={entry}
                key={i.value}
                checked={selected.includes(`${i.value}`)}
                id={`${idPrefix}memberships-${index}`}
                idPrefix={idPrefix}
                hasError={!!inputHasError}
                errorId={errorId}
                textInputHasError={errors.some(
                  (error) => error.field === i.value,
                )}
                onChange={handleCheckboxChange}
              />
            ))}
          </div>
          <div className="flex flex-col flex-1 gap-4">
            {rightColumn.map((i, index) => (
              <MembershipsCheckbox
                answer={i}
                entry={entry}
                key={i.value}
                checked={selected.includes(`${i.value}`)}
                id={`${idPrefix}memberships-${leftColumn.length + index}`}
                idPrefix={idPrefix}
                hasError={!!inputHasError}
                errorId={errorId}
                textInputHasError={errors.some(
                  (error) => error.field === i.value,
                )}
                onChange={handleCheckboxChange}
              />
            ))}
          </div>
        </div>
      </fieldset>
    </Errors>
  );
};

const MembershipsCheckbox = ({
  entry,
  answer,
  checked,
  id,
  idPrefix,
  hasError,
  errorId,
  textInputHasError,
  onChange,
}: {
  entry: Entry;
  answer: Answer;
  checked: boolean;
  id: string;
  idPrefix: string;
  hasError: boolean;
  errorId: string;
  textInputHasError: boolean;
  onChange: (value: string, checked: boolean) => void;
}) => {
  const { z } = useTranslation();
  const { data } = entry;
  const defaultValue = data?.[answer.value as keyof typeof data] ?? '';
  const labelTestId = `${id}-label`;

  return (
    <div className="w-full">
      <Errors errors={checked && hasError ? ['error'] : []} key={answer.value}>
        <label
          htmlFor={id}
          className="flex cursor-pointer"
          data-testid={labelTestId}
        >
          <input
            type="checkbox"
            name="memberships"
            id={id}
            className="sr-only peer tool-cbox"
            value={answer.value}
            checked={checked}
            aria-invalid={!!hasError || undefined}
            aria-describedby={hasError ? errorId : undefined}
            onChange={(e) => onChange(`${answer.value}`, e.target.checked)}
            data-testid={answer.value}
          />
          <div
            className={twMerge(
              'flex items-center justify-center flex-none w-10 h-10 p-1 bg-white border rounded text-transparent peer-focus:border-4 peer-focus:border-blue-700 peer-focus:ring-[3px] peer-focus:ring-yellow-400 peer-disabled:bg-slate-400 peer-disabled:border-slate-400 peer-disabled:text-slate-400 peer-disabled:cursor-not-allowed border-gray-650 active:bg-white active:border-gray-650 active:text-white',
              checked &&
                'bg-white text-green-500 border-gray-650 hover:bg-white hover:border-gray-650 hover:text-green-500 active:bg-white active:border-gray-650',
              hasError && 'border-2 border-red-500',
            )}
          >
            <Icon
              className="w-6 h-5"
              role="presentation"
              type={IconType.TICK_SQUARE}
            />
          </div>
          <div className="flex flex-col ml-3">
            <p
              className="flex items-center text-base min-h-10"
              data-testid={`${labelTestId}-children`}
            >
              {answer.text}
            </p>
          </div>
        </label>

        {checked && answer.value !== 'none' && (
          <div className="block mt-4 mb-2">
            <TextInput
              name={answer.value}
              id={`${idPrefix}${answer.value}`}
              data-testid={`input-${answer.value}`}
              defaultValue={defaultValue as string}
              className={textInputHasError ? '' : 'border-gray-650'}
              label={
                answer.value !== 'other'
                  ? z({
                      en: 'Please provide your membership number:',
                      cy: 'Rhowch eich rhif aelodaeth',
                    })
                  : ''
              }
              error={
                textInputHasError
                  ? z({
                      en: 'This value is required.',
                      cy: `Rhowch enw sefydliad dilys.`,
                    })
                  : undefined
              }
            />
          </div>
        )}
      </Errors>
    </div>
  );
};

const InputTitle = ({
  inputGroupElement,
  inputTitle,
  inputId,
}: {
  inputGroupElement: 'div' | 'fieldset';
  inputTitle: string;
  inputId: string;
}) =>
  inputGroupElement === 'fieldset' ? (
    <legend className="block mb-2 text-2xl">{inputTitle}</legend>
  ) : (
    <label htmlFor={inputId} className="block mb-2 text-2xl">
      {inputTitle}
    </label>
  );

const getInputErrorMessage = ({
  hasError,
  input,
}: {
  hasError: HasError;
  input: QuestionOrg;
}) => hasError && input?.errors?.[hasError?.type];

const InputError = ({
  hasError,
  input,
  errorMessageId,
}: {
  hasError: HasError;
  input: QuestionOrg;
  errorMessageId: string;
}) => (
  <div className="text-red-500 text-[18px] mb-1 -mt-2" id={errorMessageId}>
    {getInputErrorMessage({ hasError, input })}
  </div>
);

const InputTextOrDate = ({
  input,
  inputId,
  defaultValue,
  hasError,
}: {
  input: QuestionOrg;
  inputId: string;
  defaultValue: string;
  hasError: HasError;
}) => (
  <div className="max-w-sm">
    <TextInput
      name={input.name}
      id={inputId}
      data-testid={input.name}
      type={input.type}
      defaultValue={defaultValue}
      className={hasError ? '' : 'border-gray-650'}
      error={hasError ? input?.errors?.[hasError?.type] : undefined}
    />
  </div>
);

const InputCheckboxes = ({
  input,
  inputId,
  hasError,
  defaultValue,
}: {
  input: QuestionOrg;
  inputId: string;
  hasError: HasError;
  defaultValue: string[];
}) => (
  <CheckboxGroup
    name={input.name}
    testId={inputId}
    items={input.answers.map((region, index) => ({
      value: region.value || '',
      label: region.text,
      id: `${inputId}-${index}`,
    }))}
    label={input.title}
    hint={input.description}
    defaultChecked={defaultValue}
    hasErrorWrapper={!!hasError}
    error={getInputErrorMessage({ hasError, input })}
    className={twMerge(
      '[&_fieldset]:grid [&_fieldset]:mt-4 [&_fieldset]:items-start [&__fieldset>p:first-of-type]:text-gray-400 [&_label]:mt-4',
      input.name === 'geoRegions' &&
        `[&_fieldset]:grid-cols-2 [&__legend]:col-span-2 [&__fieldset>p]:col-span-2 odd:[&_label]:mr-4${
          hasError
            ? '[&_fieldset>p:first-of-type]:mb-4 [&_fieldset>p:last-of-type]:mt-2 [&_fieldset]:grid-rows-[auto_auto_repeat(5,1fr)]'
            : '[&_fieldset]:grid-rows-[auto_repeat(5,1fr)]'
        }`,
      input.name === 'debtAdvice' &&
        (hasError
          ? '[&__fieldset>p:first-of-type]:text-red-500'
          : '[&_legend]:mb-2'),
    )}
    checkboxClassName={twMerge(
      checkboxStyles,
      hasError ? 'border-2 border-red-500' : 'border-1 border-gray-650',
    )}
  />
);

const InputRadios = ({
  input,
  inputId,
  radioSelected,
  hasError,
  errorMessageId,
  setRadioSelected,
}: {
  input: QuestionOrg;
  inputId: string;
  radioSelected: string;
  hasError: HasError;
  errorMessageId: string;
  setRadioSelected: React.Dispatch<React.SetStateAction<string>>;
}) => (
  <>
    {input.answers.map((answer) => {
      return (
        <div key={`radio-${answer.text}`} className="mb-4">
          <RadioButton
            id={`${inputId}-${answer.value}`}
            testId={`${answer.value}`}
            radioInputTestId={`${answer.value}-input`}
            value={answer.value}
            name={input.name}
            checked={radioSelected === answer.value}
            classNameLabel={twMerge(radioStyles)}
            hasError={!!hasError}
            errorMessageId={errorMessageId}
            onChange={(e) => setRadioSelected(e.target.value)}
          >
            {answer.text}
          </RadioButton>
        </div>
      );
    })}
  </>
);

const InputSelect = ({
  input,
  inputId,
  defaultValue,
  defaultOtherValue,
  hasError,
  conditionalInputHasError,
  showConditionalInput,
  setShowConditionalInput,
}: {
  input: QuestionOrg;
  inputId: string;
  defaultValue: string;
  defaultOtherValue: string;
  hasError: HasError;
  conditionalInputHasError: boolean;
  showConditionalInput: boolean;
  setShowConditionalInput: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { z } = useTranslation();
  return (
    <div className="max-w-sm">
      <Select
        hideEmptyItem={false}
        id={inputId}
        testId={input.name}
        name={input.name}
        defaultValue={defaultValue}
        className="overflow-hidden"
        selectClassName={
          hasError && !conditionalInputHasError ? '' : 'border-gray-650'
        }
        selectIconClassName="bg-blue-600"
        emptyItemText={z({
          en: 'Select an option',
          cy: 'Dewiswch opsiwn',
        })}
        onChange={(e) => setShowConditionalInput(e.target.value === 'other')}
        options={input.answers as Options[]}
        hasError={!!hasError && !conditionalInputHasError}
        error={
          hasError && !conditionalInputHasError
            ? input?.errors?.[hasError?.type]
            : undefined
        }
      />
      {showConditionalInput && (
        <div className="mt-2 mb-8">
          <TextInput
            name={`${input.name}Other`}
            id={`${inputId}Other`}
            defaultValue={defaultOtherValue}
            className={conditionalInputHasError ? '' : 'border-gray-650'}
            error={
              hasError && conditionalInputHasError
                ? input?.errors?.[hasError?.type]
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
};

const Input = ({
  entry,
  input,
  idPrefix,
}: {
  entry: Entry;
  input: QuestionOrg;
  idPrefix: string;
}) => {
  const { data, errors } = entry;
  const [showConditionalInput, setShowConditionalInput] = useState(false);
  const [radioSelected, setRadioSelected] = useState('');

  const hasError = errors?.find(
    (error) =>
      error.field === input.name || error.field === `${input.name}Other`,
  ) as HasError;

  const defaultValue = data?.[input.name as keyof typeof data] ?? '';
  const defaultOtherValue =
    data?.[`${input.name}Other` as keyof typeof data] ?? '';

  useEffect(() => {
    setShowConditionalInput(
      defaultValue === 'other' || (defaultValue as string[])?.includes('other'),
    );
    if (data) {
      setRadioSelected((data as { [key: string]: string })[input?.name]);
    }
  }, [defaultValue, data, input]);

  const inputId = `${idPrefix}${input.name}`;
  const fieldTypeHasMultipleInputs =
    input.type === 'checkbox' || input.type === 'radio';
  const errorMessageId = `${inputId}-error`;
  const conditionalInputHasError = hasError?.field === `${input.name}Other`;
  const InputGroupElement = fieldTypeHasMultipleInputs ? 'fieldset' : 'div';

  if (input.type === 'checkbox') {
    return (
      <div className="mb-8">
        <InputCheckboxes
          input={input}
          inputId={inputId}
          hasError={hasError}
          defaultValue={defaultValue}
        />
      </div>
    );
  }

  return (
    <div>
      <Errors errors={hasError ? ['error'] : []}>
        <InputGroupElement
          key={input.name}
          className="mb-8"
          id={`${fieldTypeHasMultipleInputs ? inputId : input.name}`}
          tabIndex={fieldTypeHasMultipleInputs ? -1 : undefined}
          role={input.type === 'radio' ? 'radiogroup' : undefined}
          aria-invalid={(input.type === 'radio' && !!hasError) || undefined}
          aria-describedby={
            InputGroupElement === 'fieldset' && hasError
              ? errorMessageId
              : undefined
          }
        >
          {input.title && (
            <InputTitle
              inputGroupElement={InputGroupElement}
              inputTitle={input.title}
              inputId={inputId}
            />
          )}
          {input.description && (
            <p className="mb-4 -mt-2 text-gray-400">{input.description}</p>
          )}
          {hasError &&
            input?.errors &&
            (input.type === 'checkbox' || input.type === 'radio') && (
              <InputError
                hasError={hasError}
                input={input}
                errorMessageId={errorMessageId}
              />
            )}

          {(input.type === 'text' || input.type === 'date') && (
            <InputTextOrDate
              input={input}
              inputId={inputId}
              defaultValue={defaultValue as string}
              hasError={hasError}
            />
          )}
          {input.type === 'radio' && (
            <div className="max-w-sm mt-4">
              <InputRadios
                input={input}
                inputId={inputId}
                radioSelected={radioSelected}
                hasError={hasError}
                errorMessageId={errorMessageId}
                setRadioSelected={setRadioSelected}
              />
            </div>
          )}
          {input.type === 'select' && (
            <InputSelect
              input={input}
              inputId={inputId}
              defaultValue={defaultValue}
              defaultOtherValue={defaultOtherValue}
              hasError={hasError}
              conditionalInputHasError={conditionalInputHasError}
              showConditionalInput={showConditionalInput}
              setShowConditionalInput={setShowConditionalInput}
            />
          )}
        </InputGroupElement>
      </Errors>
    </div>
  );
};

export default SignUpOrg;
