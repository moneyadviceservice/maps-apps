import React from 'react';

import { getErrorMessageByKey, hasFieldError } from 'lib/validation/partner';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { Heading } from '@maps-react/common/components/Heading';
import { TextInput } from '@maps-react/form/components/TextInput';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type PartnerNameProps = {
  id: number;
  name: string;
  editing: boolean;
  formErrors: (Record<string, string> | undefined) | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  onDone: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
};

export const PartnerName = ({
  id,
  name,
  editing,
  formErrors,
  onChange,
  onEdit,
  onDone,
}: PartnerNameProps) => {
  const { t } = useTranslation();

  return (
    <Errors errors={hasFieldError('name', formErrors)}>
      {hasFieldError('name', formErrors).length > 0 && (
        <p id="name-error" className="mb-1 text-red-700">
          {t(`aboutYou.errors.${getErrorMessageByKey('name', formErrors)}`)}
        </p>
      )}

      <div className={editing ? 'hidden' : 'block'}>
        <Heading level="h3" variant="secondary">
          {name}
        </Heading>

        <div className="-ml-[18px] !mb-4">
          <Button
            name="action"
            value="edit"
            type="submit"
            variant="transparent"
            data-testid={`edit_name_button_${id}`}
            onClick={onEdit}
            formAction={`/api/about-you?edit=1&id=${id}&${
              formErrors ? 'error=name' : ''
            }`}
          >
            {t('aboutYou.name.editLink')}
          </Button>
        </div>
      </div>

      <div className={editing ? 'block' : 'hidden'}>
        <label htmlFor={`name_${id}`} className="block mb-2 text-lg">
          {t('aboutYou.name.labelText')}
        </label>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <TextInput
            name="name"
            id={`name_${id}`}
            value={name}
            onChange={onChange}
            className={`w-full md:max-w-[408px] h-10 px-3 text-lg border border-gray-800 rounded focus:outline-none focus:shadow-focus-outline ${
              getErrorMessageByKey('name', formErrors) ? 'border-red-700' : ''
            }`}
          />
          <Button
            className="h-10"
            variant="primary"
            type="submit"
            formAction={`/api/about-you?id=${id}`}
            onClick={onDone}
            name="action"
            value="update"
          >
            {t('aboutYou.name.editButton')}
          </Button>
        </div>
      </div>
    </Errors>
  );
};
