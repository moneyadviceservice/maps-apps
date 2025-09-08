import { useState } from 'react';

import { RetireAgeInput } from 'components/RetireAge/RetireAgeInput';
import { VisibleSection } from 'components/VisibleSection';
import { Partner } from 'lib/types/aboutYou';
import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { RadioButton } from '@maps-react/form/components/RadioButton';
import { TextInput } from '@maps-react/form/components/TextInput';

type PartnerInfoProps = {
  partners: Partner[];
  partnerInfo: Partner;
  isEditing: boolean;
  onRemove?: () => void;
};
export const PartnerInfo = ({
  partners,
  partnerInfo,
  isEditing = false,
  onRemove,
}: PartnerInfoProps) => {
  const [partner, setPartner] = useState<Partner>(partnerInfo);
  const [editing, setEditing] = useState<boolean>(isEditing);
  const [formData, setFormData] = useState<Partner>(partner);

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

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditing(false);
    setPartner(formData);
  };

  return (
    <section
      className={twMerge(
        'p-6 md:p-8 mb-6',
        partner.id === 1 ? 'bg-green-600' : 'bg-yellow-500',
      )}
    >
      <input type="hidden" name="id" value={partner.id} />

      <input
        type="hidden"
        name="partners"
        value={encodeURIComponent(JSON.stringify(partners))}
      />

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
            data-testid={`edit_name_button_${partner.id}`}
            onClick={(e) => {
              e.preventDefault();
              setEditing(true);
            }}
            formAction={`/api/about-you?edit=1&id=${
              partner.id
            }&partners=${encodeURIComponent(JSON.stringify(partners))}`}
          >
            Edit name
          </Button>
        </div>
      </div>

      <div className={editing ? 'block' : 'hidden'}>
        <label htmlFor={`name_${partner.id}`} className="block mb-2 text-lg">
          Edit name
        </label>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <input
            name={`name`}
            type="text"
            id={`name_${partner.id}`}
            defaultValue={formData.name}
            onChange={handleChange}
            className="w-full md:max-w-[408px] h-10 px-3 text-lg border border-gray-800 rounded focus:outline-none focus:shadow-focus-outline"
          />
          <Button
            className="h-10"
            variant="primary"
            type="submit"
            formAction="/api/about-you"
            onClick={handleSave}
            name="action"
            value="update"
          >
            Done
          </Button>
        </div>
      </div>

      <label
        htmlFor={`day_${partner.id}`}
        className="mb-4 text-lg text-gray-800"
      >
        What is your date of birth?
      </label>
      <div className="flex gap-5 mt-2 mb-6">
        <div className="max-w-16">
          <TextInput
            id={`day_${partner.id}`}
            name={`day`}
            type="number"
            label="Day"
            className="max-w-16"
            min={1}
            max={31}
            defaultValue={formData.dob.day}
            onChange={handleDobChange}
          />
        </div>
        <div className="max-w-16">
          <TextInput
            id={`month_${partner.id}`}
            name={`month`}
            type="number"
            label="Month"
            className="max-w-16"
            min={1}
            max={12}
            defaultValue={formData.dob.month}
            onChange={handleDobChange}
          />
        </div>
        <div className="max-w-24">
          <TextInput
            id={`year_${partner.id}`}
            name={`year`}
            type="number"
            label="Year"
            className="max-w-24"
            min={1925}
            max={2007}
            defaultValue={formData.dob.year}
            onChange={handleDobChange}
          />
        </div>
      </div>

      <label
        htmlFor={`gender[${partner.id}]`}
        className="pt-4 mb-4 text-lg text-gray-800"
      >
        What is your gender?
      </label>
      <div className="flex gap-5 mt-2 mb-6">
        <RadioButton
          id={`gender-male_${partner.id}`}
          name={`gender[${partner.id}]`}
          data-testid={`gender-male-${partner.id}`}
          value="male"
          onChange={handleGenderChange}
          defaultChecked={formData.gender === 'male'}
        >
          Male
        </RadioButton>
        <RadioButton
          id={`gender-female_${partner.id}`}
          data-testid={`gender-female-${partner.id}`}
          name={`gender[${partner.id}]`}
          value="female"
          onChange={handleGenderChange}
          defaultChecked={formData.gender === 'female'}
        >
          Female
        </RadioButton>
      </div>

      <RetireAgeInput
        suffixField={partner.id}
        retireAge={formData.retireAge}
        onAgeChange={handleChange}
      />

      <ExpandableSection
        variant="hyperlink"
        title="Why do we need your date of birth and gender?"
        testClassName="mt-4"
      >
        <div className="mb-8 text-[#000B3B]">
          To calculate your State Pension age.
        </div>
      </ExpandableSection>
      <VisibleSection visible={partner.id === 2}>
        <Button
          className="h-10"
          variant="secondary"
          type="submit"
          onClick={onRemove}
          formAction="/api/about-you"
          value="remove"
          name="action"
        >
          <Icon type={IconType.CLOSE_PINK} />
          Remove Partner
        </Button>
      </VisibleSection>
    </section>
  );
};
