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
} from 'data/form-data/org_signup';
import { Entry } from 'lib/types';
import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { H2, H3 } from '@maps-react/common/components/Heading';
import { Checkbox } from '@maps-react/form/components/Checkbox';
import { RadioButton } from '@maps-react/form/components/RadioButton';
import { Options, Select } from '@maps-react/form/components/Select';
import { TextInput } from '@maps-react/form/components/TextInput';
import { Answer } from '@maps-react/form/types';
import useTranslation from '@maps-react/hooks/useTranslation';

const SignUpOrg = ({
  entry,
  lang,
  onSubmit,
}: {
  entry: Entry;
  lang: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
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
      <H2 className="my-8 md:text-5xl">
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
              <Input entry={entry} input={input}></Input>
            </div>
          );
        })}
        <H3 className="mb-8 text-4xl">
          {z({
            en: 'Memberships',
            cy: 'Aelodaeth',
          })}
        </H3>
        <OrganisationFCA entry={entry} />
        <Memberships entry={entry} />
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

const OrganisationFCA = ({ entry }: { entry: Entry }) => {
  const { z } = useTranslation();
  const { data, errors } = entry;
  const input = orgFcaReg(z);
  const inputText = orgFcaRegNumber(z);
  const [radioSelected, setRadioSelected] = useState('');

  const hasError = errors?.find((error) => error.field === input.name) as
    | { field: string; type: string }
    | undefined;

  const hasTextError = errors?.find(
    (error) => error.field === inputText.name,
  ) as { field: string; type: string } | undefined;

  useEffect(() => {
    setRadioSelected(data?.fcaReg ?? '');
  }, [data]);

  return (
    <>
      <Errors errors={hasError ? ['error'] : []} key={input.name}>
        <div className="mb-8">
          <label
            htmlFor={input.name}
            className="block mb-4 text-2xl"
            id={`${input.name}`}
          >
            {input.title}
          </label>
          {hasError && input?.errors && (
            <div className="text-red-700 text-[18px] mb-4 -mt-2">
              {input?.errors[hasError?.type]}
            </div>
          )}
          {input.answers.map((answer) => {
            return (
              <div key={`radio-${answer.text}`} className="mb-4">
                <RadioButton
                  id={`${answer.value}`}
                  value={answer.value}
                  name={input.name}
                  checked={radioSelected === answer.value}
                  classNameLabel={twMerge(radioStyles)}
                  hasError={!!hasError}
                  onChange={(e) => setRadioSelected(e.target.value)}
                >
                  {answer.text}
                </RadioButton>
              </div>
            );
          })}
        </div>
      </Errors>
      {radioSelected === 'fca-yes' && (
        <Errors errors={hasTextError ? ['error'] : []} key={inputText.name}>
          <div className="max-w-sm mb-8">
            <label htmlFor={inputText.name} className="block mb-2 text-2xl">
              {inputText.title}
            </label>
            {hasTextError && inputText?.errors && (
              <div className="text-red-700 text-[18px] mb-4 -mt-2">
                {inputText?.errors[hasTextError?.type]}
              </div>
            )}
            <TextInput
              name={inputText.name}
              id={inputText.name}
              defaultValue={data?.fcaRegNumber ?? ''}
            />
          </div>
        </Errors>
      )}
    </>
  );
};

const Memberships = ({ entry }: { entry: Entry }) => {
  const { z } = useTranslation();
  const input = membershipBodyOpt(z);
  const { errors } = entry;

  const hasError = errors?.find((error) => error.field.includes(input.name));

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
      <div className="max-w-2xl mb-8">
        <label
          htmlFor="memberships"
          className="block mb-4 text-2xl"
          id={input.name}
        >
          {input.title}
        </label>
        {hasError && input?.errors && (
          <div className="text-red-700 text-[18px] mb-2 -mt-1">
            {input?.errors[hasError.type]}
          </div>
        )}

        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex flex-col flex-1 gap-4">
            {leftColumn.map((i) => (
              <InputCheckbox
                answer={i}
                entry={entry}
                key={i.value}
                checked={selected.includes(`${i.value}`)}
                onChange={handleCheckboxChange}
              />
            ))}
          </div>
          <div className="flex flex-col flex-1 gap-4">
            {rightColumn.map((i) => (
              <InputCheckbox
                answer={i}
                entry={entry}
                key={i.value}
                checked={selected.includes(`${i.value}`)}
                onChange={handleCheckboxChange}
              />
            ))}
          </div>
        </div>
      </div>
    </Errors>
  );
};

const InputCheckbox = ({
  entry,
  answer,
  checked,
  onChange,
}: {
  entry: Entry;
  answer: Answer;
  checked: boolean;
  onChange: (value: string, checked: boolean) => void;
}) => {
  const { z } = useTranslation();
  const { data, errors } = entry;

  const hasError = errors?.find((error) => error.field === answer.value) as
    | { field: string; type: string }
    | undefined;

  const defaultValue = data?.[answer.value as keyof typeof data] ?? '';

  return (
    <div className="w-full">
      <Errors errors={checked && hasError ? ['error'] : []} key={answer.value}>
        <Checkbox
          name="memberships"
          id={answer.value}
          checkboxClassName={twMerge(checkboxStyles)}
          value={answer.value}
          checked={checked}
          onChange={(e) => onChange(`${answer.value}`, e.target.checked)}
          data-testid={answer.value}
        >
          {answer.text}
        </Checkbox>

        {checked && answer.value !== 'none' && (
          <div className="block mt-4 mb-2">
            {hasError && (
              <div className="text-red-700 text-[18px] mb-2 -mt-1">
                {z({
                  en: 'This value is required.',
                  cy: `Rhowch enw sefydliad dilys.`,
                })}
              </div>
            )}
            <TextInput
              name={answer.value}
              id={answer.value}
              data-testid={`input-${answer.value}`}
              defaultValue={defaultValue as string}
              label={
                answer.value !== 'other'
                  ? z({
                      en: 'Please provide your membership number:',
                      cy: 'Rhowch eich rhif aelodaeth',
                    })
                  : ''
              }
            />
          </div>
        )}
      </Errors>
    </div>
  );
};

const Input = ({ entry, input }: { entry: Entry; input: QuestionOrg }) => {
  const { z } = useTranslation();
  const { data, errors } = entry;
  const [showInput, setShowInput] = useState(false);
  const [radioSelected, setRadioSelected] = useState('');

  const hasError = errors?.find(
    (error) =>
      error.field === input.name || error.field === `${input.name}Other`,
  ) as { field: string; type: string } | undefined;

  const defaultValue = data?.[input.name as keyof typeof data] ?? '';
  const defaultOtherValue =
    data?.[`${input.name}Other` as keyof typeof data] ?? '';

  useEffect(() => {
    setShowInput(
      defaultValue === 'other' || (defaultValue as string[])?.includes('other'),
    );
    if (data) {
      setRadioSelected((data as { [key: string]: string })[input?.name]);
    }
  }, [defaultValue, data, input]);

  return (
    <div>
      <Errors errors={hasError ? ['error'] : []}>
        <div key={input.name} className="mb-8" id={`${input.name}`}>
          {input.title && (
            <label htmlFor={input.name} className="block mb-2 text-2xl">
              {input.title}
            </label>
          )}
          {input.description && (
            <p className="mb-4 -mt-2 text-gray-400">{input.description}</p>
          )}
          {hasError && input?.errors && (
            <div className="text-red-700 text-[18px] mb-1 -mt-2">
              {input?.errors[hasError?.type]}
            </div>
          )}

          {(input.type === 'text' || input.type === 'date') && (
            <div className="max-w-sm">
              <TextInput
                name={input.name}
                id={input.name}
                type={input.type}
                defaultValue={defaultValue as string}
              />
            </div>
          )}

          {input.type === 'checkbox' && (
            <div
              className={twMerge(
                'grid my-4 gap-4 items-start',
                input.name === 'geoRegions' && 'grid-rows-6 grid-flow-col',
              )}
            >
              {input.answers.map((region, index) => (
                <Checkbox
                  key={`${input.name}${index}`}
                  name={`${input.name}`}
                  checkboxClassName={twMerge(checkboxStyles)}
                  value={region.value}
                  defaultChecked={(defaultValue as string[]).includes(
                    region?.value as string,
                  )}
                  onChange={(e) => {
                    setShowInput(
                      e.target.value === 'other' && e.target.checked,
                    );
                  }}
                >
                  {region.text}
                </Checkbox>
              ))}
              {showInput && (
                <div className="max-w-sm mt-2">
                  <TextInput
                    name={`${input.name}Other`}
                    id={`${input.name}Other`}
                    defaultValue={defaultOtherValue as string}
                  />
                </div>
              )}
            </div>
          )}

          {input.type === 'radio' && (
            <div className="max-w-sm mt-4">
              {input.answers.map((answer) => {
                return (
                  <div key={`radio-${answer.text}`} className="mb-4">
                    <RadioButton
                      id={`${answer.value}`}
                      value={answer.value}
                      name={input.name}
                      checked={radioSelected === answer.value}
                      classNameLabel={twMerge(radioStyles)}
                      hasError={!!hasError}
                      onChange={(e) => {
                        setRadioSelected(e.target.value);
                        setShowInput(e.target.value === 'fca-yes');
                      }}
                    >
                      {answer.text}
                    </RadioButton>
                  </div>
                );
              })}
            </div>
          )}

          {input.type === 'select' && (
            <div className="max-w-sm">
              <Select
                hideEmptyItem={false}
                id={input.name}
                name={input.name}
                defaultValue={(defaultValue as string) ?? ''}
                selectIconClassName="bg-blue-600"
                emptyItemText={z({
                  en: 'Select an option',
                  cy: 'Dewiswch opsiwn',
                })}
                onChange={(e) => setShowInput(e.target.value === 'other')}
                options={input.answers as Options[]}
              />
              {showInput && (
                <div className="mt-2 mb-8">
                  <TextInput
                    name={`${input.name}Other`}
                    id={`${input.name}Other`}
                    defaultValue={defaultOtherValue as string}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </Errors>
    </div>
  );
};

export default SignUpOrg;
