import { H1 } from '@maps-digital/shared/ui';

import useTranslation from '@maps-react/hooks/useTranslation';

import { StepComponent } from '../../lib/types';
import { OptionTypes } from '../OptionTypes';

export const EnquiryType: StepComponent = ({ errors, step }) => {
  const { t } = useTranslation();
  const formContentKey = 'components.enquiry-type.form.flow';

  return (
    <div className="md:max-w-5xl">
      <H1 className="mb-4 text-blue-800" data-testid="enquiry-type-title">
        {t(`components.enquiry-type.title`)}
      </H1>
      <OptionTypes
        errors={errors}
        step={step}
        optionsContentKey={`${formContentKey}.options`}
        formErrorContentKey={`${formContentKey}.error`}
      />
    </div>
  );
};
