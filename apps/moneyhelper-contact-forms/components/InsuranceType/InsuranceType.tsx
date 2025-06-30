import { H1 } from '@maps-react/common/components/Heading';
import useTranslation from '@maps-react/hooks/useTranslation';

import { StepComponent } from '../../lib/types';
import { OptionTypes } from '../OptionTypes';

export const InsuranceType: StepComponent = ({ errors, step }) => {
  const { t } = useTranslation();
  const contentKey = 'components.insurance-type';

  return (
    <div className="md:max-w-5xl">
      <H1 className="mb-4 text-blue-800" data-testid="insurance-type-title">
        {t(`${contentKey}.title`)}
      </H1>
      <OptionTypes
        errors={errors}
        step={step}
        optionsContentKey={`${contentKey}.form.flow.options`}
        formErrorContentKey={`${contentKey}.form.flow.error`}
      />
    </div>
  );
};
