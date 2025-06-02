import { H1 } from '@maps-react/common/components/Heading';
import useTranslation from '@maps-react/hooks/useTranslation';

import { StepComponent } from '../../lib/types';
import { EnquiryOptions } from '../EnquiryOptions';

export const KindOfEnquiry: StepComponent = ({ errors, flow }) => {
  const { t } = useTranslation();
  const formContentKey = 'components.kind-of-enquiry.form.flow';

  return (
    <div className="md:max-w-5xl">
      <H1 className="mb-4 text-blue-800" data-testid="kind-of-enquiry-title">
        {t(`components.kind-of-enquiry.${flow}.title`)}
      </H1>
      <EnquiryOptions
        errors={errors}
        optionsContentKey={`${formContentKey}.${flow}.options`}
        formErrorContentKey={`${formContentKey}.error`}
      />
    </div>
  );
};
