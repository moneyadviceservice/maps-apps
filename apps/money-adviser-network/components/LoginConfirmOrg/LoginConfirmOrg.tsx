import { FormFields, loginFields } from 'data/login';
import { FormField } from 'data/login/types';
import { twMerge } from 'tailwind-merge';

import { Errors } from '@maps-react/common/components/Errors';
import { Checkbox } from '@maps-react/form/components/Checkbox';
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
    <Errors errors={error} className="mb-6" testId={`${name}-errors`}>
      {error && (
        <div className="text-red-700 text-[18px] my-1" aria-describedby={name}>
          {error.toString()}
        </div>
      )}
      <Checkbox
        id={name}
        className={twMerge('text-lg')}
        name={name}
        hasError={error?.length > 0}
        labelTestId={`${name}-label`}
      >
        <>
          <span>{label}</span>{' '}
          <span className="font-bold">{user?.organisationName}</span>
          {'.'}
          <span className="text-lg text-gray-650 block">{info}</span>
        </>
      </Checkbox>
    </Errors>
  );
};
