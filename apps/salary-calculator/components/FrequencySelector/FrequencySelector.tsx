import { useEffect, useState } from 'react';

import { Button } from '@maps-react/common/components/Button';
import { Select } from '@maps-react/form/components/Select';
import { useLanguage } from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import type { FrequencyType } from '../ResultsTable/ResultsTable';

export interface FrequencySelectorProps {
  currentFrequency: FrequencyType;
  onFrequencyChange: (frequency: FrequencyType) => void;
  formData?: Record<string, string>;
  isComparison?: boolean;
}

export const FrequencySelector = ({
  currentFrequency,
  onFrequencyChange,
  formData = {},
  isComparison = false,
}: FrequencySelectorProps) => {
  const { z } = useTranslation();
  const language = useLanguage();
  const [isJsEnabled, setIsJsEnabled] = useState(false);

  useEffect(() => {
    setIsJsEnabled(true);
  }, []);

  const options = [
    { text: z({ en: 'Annually', cy: 'Blynyddol' }), value: 'yearly' },
    { text: z({ en: 'Monthly', cy: 'Misol' }), value: 'monthly' },
    { text: z({ en: 'Weekly', cy: 'Wythnosol' }), value: 'weekly' },
    { text: z({ en: 'Daily', cy: 'Dyddiol' }), value: 'daily' },
  ];

  return (
    <div
      className={`${
        isComparison ? 'justify-start' : 'justify-end'
      } flex w-full gap-2 mt-4 mb-4`}
    >
      {/* JS solution - useState with onChange */}
      {isJsEnabled ? (
        <Select
          value={currentFrequency}
          onChange={(e) =>
            onFrequencyChange(e.currentTarget.value as FrequencyType)
          }
          options={options}
          className="flex-1 lg:flex-none"
          selectClassName="w-full lg:w-48 px-3 py-1 text-gray-800"
          aria-label={z({
            en: 'Select frequency to display results',
            cy: 'Dewiswch amledd i ddangos canlyniadau',
          })}
        />
      ) : (
        /* Non-JS solution - form submission with button */
        <form
          method="get"
          action={`/${language}#${
            isComparison ? 'results-comparison' : 'results'
          }`}
          className="flex flex-col w-full gap-2 sm:flex-row sm:items-center sm:w-auto"
          data-testid="form"
        >
          {/* Preserve all query params except results frequency */}
          {Object.entries(formData).map(([key, value]) => {
            if (key === 'resultsFrequency') return null;
            return <input key={key} type="hidden" name={key} value={value} />;
          })}

          <Select
            id="resultsFrequency"
            name="resultsFrequency"
            defaultValue={currentFrequency}
            options={options}
            className="w-full sm:w-auto"
            selectClassName="w-full sm:w-48 px-2 py-1"
            hideEmptyItem={true}
            aria-label={z({
              en: 'Select frequency to display results',
              cy: 'Dewiswch amledd i ddangos canlyniadau',
            })}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-4 sm:w-auto sm:mt-0"
          >
            {z({ en: 'Update', cy: 'Diweddaru' })}
          </Button>
        </form>
      )}
    </div>
  );
};
