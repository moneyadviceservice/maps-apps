import { H1 } from '@maps-digital/shared/ui';

import useTranslation from '@maps-react/hooks/useTranslation';

import { StepComponent } from '../../lib/types';
import { EnquiryOptions } from '../EnquiryOptions';

export const EnquiryType: StepComponent = ({ errors }) => {
  const { t } = useTranslation();
  const formContentKey = 'components.enquiry-type.form.flow';

  return (
    <div className="md:max-w-5xl">
      <H1 className="mb-4 text-blue-800" data-testid="enquiry-type-title">
        {t(`components.enquiry-type.title`)}
      </H1>
      <EnquiryOptions
        errors={errors}
        optionsContentKey={`${formContentKey}.options`}
        formErrorContentKey={`${formContentKey}.error`}
      />
    </div>
  );
};
