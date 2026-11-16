import { FormFields, loginFields } from 'data/login';
import { FormField } from 'data/login/types';
import { twMerge } from 'tailwind-merge';

import { CheckboxGroup } from '@maps-react/form/components/Checkbox';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export type Props = {
  user: {
    referrerId: string;
    organisationConfirmed?: boolean;
    organisationName?: string;
  };
  formErrors: Record<string, string[]>;
};

export const LoginConfirmOrg = ({ user, formErrors }: Props) => {
  const { z } = useTranslation();

  const fields = loginFields(z) as FormFields;
  const confirmOrganisation = fields.find(
    (f) => f.name === 'confirmOrganisation',
  ) as FormField;
  const { name, label, info } = confirmOrganisation;

  const error = formErrors[name];

  return (
    <CheckboxGroup
      className={twMerge('text-lg')}
      name={name}
      error={error?.length > 0 ? error.toString() : undefined}
      hasErrorWrapper={true}
      testId={name}
      items={[
        {
          label: (
            <span className="flex flex-col gap-1">
              <span>
                <span>{label}</span>
                <span className="font-bold">{user?.organisationName}.</span>
              </span>
              <span className="text-lg text-gray-650 block">{info}</span>
            </span>
          ),
          value: 'confirm',
        },
      ]}
    ></CheckboxGroup>
  );
};
