import React from 'react';

import { Partner } from 'lib/types/aboutYou';
import {
  dayErrorKeys,
  monthErrorKeys,
  yearErrorKeys,
} from 'lib/util/aboutYou/aboutYou';
import { getErrorMessageByKey, hasFieldError } from 'lib/validation/partner';

import { Errors } from '@maps-react/common/components/Errors';
import { TextInput } from '@maps-react/form/components/TextInput';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type PartnerDobProps = {
  dob: Partner['dob'];
  formErrors: (Record<string, string> | undefined) | null;
  onDobChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const PartnerDob = ({
  dob,
  formErrors,
  onDobChange,
}: PartnerDobProps) => {
  const { t } = useTranslation();

  const dobError = getErrorMessageByKey('dob', formErrors) || '';

  const dayHasError = dayErrorKeys.includes(dobError);
  const monthHasError = monthErrorKeys.includes(dobError);
  const yearHasError = yearErrorKeys.includes(dobError);

  return (
    <Errors errors={hasFieldError('dob', formErrors)}>
      <label htmlFor={`day`} className="mb-4 text-lg text-gray-800">
        {t('aboutYou.dob.labelText')}
      </label>

      {hasFieldError('dob', formErrors).length > 0 && (
        <p id="dob-error" className="mb-1 text-red-700">
          {t(`aboutYou.errors.${getErrorMessageByKey('dob', formErrors)}`)}
        </p>
      )}
      <div className="flex gap-5 mt-2 mb-6">
        <div className="max-w-16">
          <TextInput
            id={`day`}
            name="day"
            type="number"
            label={t('aboutYou.dob.day')}
            className={`max-w-16 ${dayHasError ? 'border-red-700' : ''}`}
            min={1}
            max={31}
            value={dob?.day ?? ''}
            onChange={onDobChange}
            aria-describedby={dayHasError ? `dob-error` : undefined}
          />
        </div>
        <div className="max-w-16">
          <TextInput
            id={`month`}
            name="month"
            type="number"
            label={t('aboutYou.dob.month')}
            className={`max-w-16 ${monthHasError ? 'border-red-700' : ''}`}
            min={1}
            max={12}
            value={dob?.month ?? ''}
            onChange={onDobChange}
            aria-describedby={monthHasError ? `dob-error` : undefined}
          />
        </div>
        <div className="max-w-24">
          <TextInput
            id={`year`}
            name="year"
            type="number"
            label={t('aboutYou.dob.year')}
            className={`max-w-24 ${yearHasError ? 'border-red-700' : ''}`}
            min={1925}
            value={dob?.year ?? ''}
            onChange={onDobChange}
            aria-describedby={yearHasError ? `dob-error` : undefined}
          />
        </div>
      </div>
    </Errors>
  );
};
