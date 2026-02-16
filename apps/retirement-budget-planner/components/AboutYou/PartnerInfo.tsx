import { useEffect, useState } from 'react';

import { RetireAgeInput } from 'components/RetireAge/RetireAgeInput';
import { Partner } from 'lib/types/aboutYou';
import { getErrorMessageByKey, hasFieldError } from 'lib/validation/partner';
import { twMerge } from 'tailwind-merge';

import { Errors } from '@maps-react/common/components/Errors';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { RadioButton } from '@maps-react/form/components/RadioButton';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { PartnerDob } from './PartnerDOB';

type PartnerInfoProps = {
  partnerInfo: Partner;
  formErrors: (Record<string, string> | undefined) | null;
};
export const PartnerInfo = ({ partnerInfo, formErrors }: PartnerInfoProps) => {
  const [formData, setFormData] = useState<Partner>(partnerInfo);
  useEffect(() => {
    setFormData(partnerInfo);
  }, [partnerInfo]);
  const { t } = useTranslation();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      dob: {
        ...prev.dob,
        [name]: value,
      },
    }));
  };
  const handleGenderChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  return (
    <section key={`partner_1`} className={twMerge('mb-6')}>
      <input type="hidden" name="id" value={1} />

      <input
        id={`partners_${formData.id}`}
        type="hidden"
        name="partner"
        value={encodeURIComponent(JSON.stringify(partnerInfo))}
      />
      <PartnerDob
        dob={formData.dob}
        formErrors={formErrors}
        onDobChange={handleDobChange}
      />

      <Errors errors={hasFieldError('gender', formErrors)}>
        <label
          htmlFor={`gender[${formData.id}]`}
          className="pt-4 mb-4 text-lg text-gray-800"
        >
          {t('aboutYou.gender.labelText')}
        </label>
        {hasFieldError('gender', formErrors).length > 0 && (
          <p id="gender-error" className="mb-1 text-red-700">
            {t(`aboutYou.errors.${getErrorMessageByKey('gender', formErrors)}`)}
          </p>
        )}
        <div className="flex gap-5 mt-2 mb-6">
          <RadioButton
            id={`gender-male`}
            name={`gender`}
            data-testid={`gender-male`}
            value="male"
            onChange={handleGenderChange}
            checked={formData.gender === 'male'}
            hasError={!!getErrorMessageByKey('gender', formErrors)}
            classNameLabel="before:bg-white"
          >
            {t('aboutYou.gender.male')}
          </RadioButton>
          <RadioButton
            id={`gender-female`}
            data-testid={`gender-female`}
            name={`gender`}
            value="female"
            onChange={handleGenderChange}
            checked={formData.gender === 'female'}
            hasError={!!getErrorMessageByKey('gender', formErrors)}
            classNameLabel="before:bg-white"
          >
            {t('aboutYou.gender.female')}
          </RadioButton>
        </div>
      </Errors>
      <RetireAgeInput
        key={formData.id}
        retireAge={formData.retireAge}
        onAgeChange={handleChange}
        formErrors={formErrors}
      />

      <ExpandableSection
        variant="hyperlink"
        title={t('aboutYou.moreInfo.moreInfoLink')}
        testClassName="mt-4"
      >
        <div className="mb-8 text-[#000B3B]">
          {t('aboutYou.moreInfo.infoText')}
        </div>
      </ExpandableSection>
    </section>
  );
};
