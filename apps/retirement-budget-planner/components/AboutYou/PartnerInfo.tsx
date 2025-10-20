import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { RetireAgeInput } from 'components/RetireAge/RetireAgeInput';
import { VisibleSection } from 'components/VisibleSection';
import { useSessionId } from 'context/SessionContextProvider';
import { Partner } from 'lib/types/aboutYou';
import { filterFirstPartner } from 'lib/util/about-you';
import { getErrorMessageByKey, hasFieldError } from 'lib/validation/partner';
import { updatePartnerInformation } from 'services/about-you';
import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { RadioButton } from '@maps-react/form/components/RadioButton';
import { TextInput } from '@maps-react/form/components/TextInput';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type PartnerInfoProps = {
  partners: Partner[];
  partnerInfo: Partner;
  isEditing: boolean;
  formErrors?: Record<keyof Partner, string> | null;
  onPartnerDetailsChange: Dispatch<SetStateAction<Partner[]>>;
};
export const PartnerInfo = ({
  partners,
  partnerInfo,
  isEditing = false,
  onPartnerDetailsChange,
  formErrors,
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
      className={twMerge(
        'p-6 md:p-8 mb-6',
        formData.id === 1 ? '' : 'bg-slate-200',
      )}
    >
      <input type="hidden" name="id" value={formData.id} />

      <input
        id={`partners_${formData.id}`}
        type="hidden"
        name="partners"
        value={encodeURIComponent(JSON.stringify(partners))}
      />
      <Errors errors={hasFieldError('name', formErrors)}>
        {hasFieldError('name', formErrors).length > 0 && (
          <p id="name-error" className="mb-1 text-red-700">
            {t(`aboutYou.errors.${getErrorMessageByKey('name', formErrors)}`)}
          </p>
        )}
        <div className={editing ? 'hidden' : 'block'}>
          <Heading level="h3" variant="secondary">
            {formData.name}
          </Heading>

          <div className="-ml-[18px] !mb-4">
            <Button
              name="action"
              value="edit"
              type="submit"
              variant="transparent"
              data-testid={`edit_name_button_${formData.id}`}
              onClick={handleEdit}
              formAction={`/api/about-you?edit=1&id=${formData.id}`}
            >
              {t('aboutYou.name.editLink')}
            </Button>
          </div>
        </div>

        <div className={editing ? 'block' : 'hidden'}>
          <label htmlFor={`name_${formData.id}`} className="block mb-2 text-lg">
            {t('aboutYou.name.labelText')}
          </label>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <TextInput
              name="name"
              id={`name_${formData.id}`}
              value={formData.name}
              onChange={handleChange}
              className="w-full md:max-w-[408px] h-10 px-3 text-lg border border-gray-800 rounded focus:outline-none focus:shadow-focus-outline"
            />
            <Button
              className="h-10"
              variant="primary"
              type="submit"
              formAction="/api/about-you"
              onClick={handleDone}
              name="action"
              value="update"
            >
              {t('aboutYou.name.editButton')}
            </Button>
          </div>
        </div>
      </Errors>
      <label
        htmlFor={`day_${formData.id}`}
        className="mb-4 text-lg text-gray-800"
      >
        {t('aboutYou.dob.labelText')}
      </label>
      <Errors errors={hasFieldError('dob', formErrors)}>
        {hasFieldError('dob', formErrors).length > 0 && (
          <p id="dob-error" className="mb-1 text-red-700">
            {t(`aboutYou.errors.${getErrorMessageByKey('dob', formErrors)}`)}
          </p>
        )}
        <div className="flex gap-5 mt-2 mb-6">
          <div className="max-w-16">
            <TextInput
              id={`day_${formData.id}`}
              name={`day`}
              type="number"
              label={t('aboutYou.dob.day')}
              className={`max-w-16, ${
                getErrorMessageByKey('dob', formErrors) ? 'border-red-700' : ''
              }`}
              min={1}
              max={31}
              defaultValue={formData.dob.day}
              onChange={handleDobChange}
            />
          </div>
          <div className="max-w-16">
            <TextInput
              id={`month_${formData.id}`}
              name={`month`}
              type="number"
              label={t('aboutYou.dob.month')}
              className={`max-w-16, ${
                getErrorMessageByKey('dob', formErrors) ? 'border-red-700' : ''
              }`}
              min={1}
              max={12}
              defaultValue={formData.dob.month}
              onChange={handleDobChange}
            />
          </div>
          <div className="max-w-24">
            <TextInput
              id={`year_${formData.id}`}
              name={`year`}
              type="number"
              label={t('aboutYou.dob.year')}
              className={`max-w-24, ${
                getErrorMessageByKey('dob', formErrors) ? 'border-red-700' : ''
              }`}
              min={1925}
              max={2007}
              defaultValue={formData.dob.year}
              onChange={handleDobChange}
            />
          </div>
        </div>
      </Errors>
      <label
        htmlFor={`gender[${formData.id}]`}
        className="pt-4 mb-4 text-lg text-gray-800"
      >
        {t('aboutYou.gender.labelText')}
      </label>
      <Errors errors={hasFieldError('gender', formErrors)}>
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
