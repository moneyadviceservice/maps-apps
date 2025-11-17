import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { RetireAgeInput } from 'components/RetireAge/RetireAgeInput';
import { VisibleSection } from 'components/VisibleSection';
import { useSessionId } from 'context/SessionContextProvider';
import { Partner } from 'lib/types/aboutYou';
import { filterFirstPartner } from 'lib/util/about-you';
import {
  getErrorMessageByKey,
  hasFieldError,
  validateName,
} from 'lib/validation/partner';
import { updatePartnerInformation } from 'services/about-you';
import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { RadioButton } from '@maps-react/form/components/RadioButton';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { PartnerDob } from './PartnerDOB';
import { PartnerName } from './PartnerName';

type PartnerInfoProps = {
  partners: Partner[];
  partnerInfo: Partner;
  isEditing: boolean;
  formErrors: (Record<string, string> | undefined) | null;
  onPartnerDetailsChange: Dispatch<SetStateAction<Partner[]>>;
  onError: (errs: Record<string, string>) => void;
};
export const PartnerInfo = ({
  partners,
  partnerInfo,
  isEditing = false,
  onPartnerDetailsChange,
  formErrors,
  onError,
}: PartnerInfoProps) => {
  const [editing, setEditing] = useState<boolean>(isEditing);
  const [formData, setFormData] = useState<Partner>(partnerInfo);

  const sessionId = useSessionId();
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
  const updatePartnerDetails = async () => {
    const updatedPartners = partners.map((p) =>
      p.id === formData.id ? { ...p, ...formData } : p,
    );
    await updatePartnerInformation(updatedPartners, sessionId);
    onPartnerDetailsChange(updatedPartners);
  };

  const handleDone = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const nameError = validateName(
      formData.id,
      formData.name,
      formErrors || null,
    );
    if (nameError) {
      onError(nameError);
      return;
    }
    onError({ ...formErrors, name: '' });

    setEditing(false);

    await updatePartnerDetails();
  };

  const handleEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditing(true);
    await updatePartnerDetails();
  };

  const handleRemove = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const updatedPartners = partners.map((p) =>
      p.id === formData.id ? { ...p, ...formData } : p,
    );

    const removedPartners = filterFirstPartner(updatedPartners, 2);
    await updatePartnerInformation(removedPartners, sessionId);
    onPartnerDetailsChange(removedPartners);
  };

  return (
    <section
      key={`partner_${formData.id}_${formData}.name`}
      className={twMerge('mb-6', formData.id === 1 ? '' : 'bg-slate-200')}
    >
      <input type="hidden" name="id" value={formData.id} />

      <input
        id={`partners_${formData.id}`}
        type="hidden"
        name="partners"
        value={encodeURIComponent(JSON.stringify(partners))}
      />
      <PartnerName
        id={formData.id}
        name={formData.name}
        editing={editing}
        formErrors={formErrors}
        onChange={handleChange}
        onEdit={handleEdit}
        onDone={handleDone}
      />

      <PartnerDob
        idSuffix={formData.id}
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
            id={`gender-male_${formData.id}`}
            name={`gender[${formData.id}]`}
            data-testid={`gender-male-${formData.id}`}
            value="male"
            onChange={handleGenderChange}
            checked={formData.gender === 'male'}
            hasError={!!getErrorMessageByKey('gender', formErrors)}
            classNameLabel="before:bg-white"
          >
            {t('aboutYou.gender.male')}
          </RadioButton>
          <RadioButton
            id={`gender-female_${formData.id}`}
            data-testid={`gender-female-${formData.id}`}
            name={`gender[${formData.id}]`}
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
        suffixField={formData.id}
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
      <VisibleSection visible={formData.id === 2}>
        <Button
          className="h-10 mt-4"
          variant="secondary"
          type="submit"
          onClick={handleRemove}
          formAction="/api/about-you"
          value="remove"
          name="action"
          data-testid={`remove_partner_button`}
        >
          <Icon type={IconType.CLOSE_PINK} />
          {t('aboutYou.removePartner.buttonLabel')}
        </Button>
      </VisibleSection>
    </section>
  );
};
