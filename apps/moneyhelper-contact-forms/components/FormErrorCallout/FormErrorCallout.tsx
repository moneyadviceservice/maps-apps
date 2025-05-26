import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
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
      className="mb-8 border-4 border-red-700 rounded p-7"
      data-testid="error-callout"
    >
      <div className="flex gap-4 sm:gap-6">
        <div>
          <Icon className="text-red-700" type={IconType.WARNING} />
        </div>
        <div>
          <Heading className="mb-2" level="h4" component={'p'}>
            {t('common.error-callout.title')}
          </Heading>
          <div className="ml-10">
            <ListElement
              color="magenta"
              items={errors.map((error) => (
                <span
                  className="text-red-700"
                  key={error.field}
                  data-testid={`error-callout-${error.field}`}
                >
                  {t(`components.${step}.form.${error.message}.error`)}
                </span>
              ))}
              variant="unordered"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
