import { Heading } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import useTranslation from '@maps-react/hooks/useTranslation';

import { FormError } from '../../lib/types';

type FormErrorCalloutProps = {
  errors?: FormError[];
  step?: string;
};

export const FormErrorCallout = ({ errors, step }: FormErrorCalloutProps) => {
  const { t } = useTranslation();

  // If there are no errors, return null
  if (!errors || errors.length === 0 || !step) {
    return null;
  }

  return (
    <div
      className="border-4 border-red-700 rounded p-7"
      data-testid="error-callout"
    >
      <Heading className="mb-3" level="h4" component={'p'}>
        {t('common.error-callout.title')}
      </Heading>
      <div className="ml-10">
        <ListElement
          color="magenta"
          items={errors.map((error) => (
            <span
              className="text-red-700 underline"
              key={error.field}
              data-testid={`error-callout-${error.field}`}
            >
              {t(`components.${step}.form.${error.message}.error`)}
            </span>
          ))}
          variant="unordered"
          data-testid="error-callout-list"
        />
      </div>
    </div>
  );
};
