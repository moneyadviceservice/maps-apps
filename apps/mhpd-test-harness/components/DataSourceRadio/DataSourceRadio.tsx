'use client';

import { useState } from 'react';

import { twMerge } from 'tailwind-merge';

import { Paragraph } from '@maps-react/common/components/Paragraph';

type Props = {
  redirect: string;
  scenariosComposerDev: { displayValue: string; requestValue: string }[];
  scenariosComposerTest: { displayValue: string; requestValue: string }[];
  scenariosComposerStaging: { displayValue: string; requestValue: string }[];
  backEndError: string;
};

export const DataSourceRadio = ({
  redirect,
  scenariosComposerDev,
  scenariosComposerTest,
  scenariosComposerStaging,
  backEndError,
}: Props) => {
  const [selectedOption, setSelectedOption] = useState<string>(
    'scenariosComposerDev',
  );
  const [scenariosToUse, setScenariosToUse] = useState(scenariosComposerDev);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
    switch (value) {
      case 'scenariosComposerTest':
        setScenariosToUse(scenariosComposerTest);
        break;
      case 'scenariosComposerStaging':
        setScenariosToUse(scenariosComposerStaging);
        break;
      default:
        setScenariosToUse(scenariosComposerDev);
    }
  };

  const radioData = [
    {
      id: 'radio-1',
      value: 'scenariosComposerDev',
      label: 'Dev',
    },
    {
      id: 'radio-2',
      value: 'scenariosComposerTest',
      label: 'Test',
    },
    {
      id: 'radio-3',
      value: 'scenariosComposerStaging',
      label: 'Staging',
    },
  ];

  const radioContainerClasses =
    'flex cursor-pointer items-center border-2 border-white bg-gray-100 rounded hover:border-yellow-400 p-3';

  const selectedRadioClasses = 'bg-yellow-400 border-yellow-400';

  return (
    <>
      {!backEndError ? (
        <>
          <legend>
            <Paragraph className="text-lg">
              Choose a source for the list of scenarios
            </Paragraph>
          </legend>

          <div className="mb-8 sm:grid sm:grid-cols-3 sm:gap-4">
            {radioData.map((radio, i) => (
              <label
                key={radio.id}
                className={twMerge(
                  radioContainerClasses,
                  selectedOption === radio.value && selectedRadioClasses,
                )}
              >
                <input
                  className="w-[20px] h-[20px] m-0 mr-2 cursor-pointer shrink-0"
                  type="radio"
                  name="radio"
                  id={radio.id}
                  value={radio.value}
                  defaultChecked={selectedOption === radio.value}
                  onChange={handleChange}
                  data-testid={`radio-${i + 1}`}
                />
                <div data-testid={`radio-label-${i + 1}`}>{radio.label}</div>
              </label>
            ))}
          </div>
        </>
      ) : null}

      <form action={'/api/submit-test-scenario'} method="POST">
        <div className="mb-12">
          <Paragraph className="text-lg">
            (1) Select a test scenario below.
          </Paragraph>
          <Paragraph className="text-lg">
            (2) On submit, you will then be redirected to{' '}
            <strong>{redirect}</strong> and a query param{' '}
            <code className="px-2 py-1 mx-1 text-xs bg-gray-100">
              /?testScenarioCode=
            </code>{' '}
            appended with the value of the test scenario selected.
          </Paragraph>
        </div>
        <input type="hidden" name="redirect" value={redirect} />
        <label htmlFor="options">Choose an option:</label>
        <select
          id="options"
          name="selectedOption"
          className="w-full p-2 mt-2 bg-gray-100 border-2 rounded border-gray-350"
        >
          {scenariosToUse.map((scenario) => (
            <option key={scenario.requestValue} value={scenario.requestValue}>
              {scenario.displayValue}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="max-sm:w-full mt-4 px-3 py-2 font-semibold sm:w-64 rounded outline-none shadow-bottom-gray justify-center bg-[#c82a87] text-white hover:bg-[#ae0060]"
        >
          Submit
        </button>
      </form>
    </>
  );
};
