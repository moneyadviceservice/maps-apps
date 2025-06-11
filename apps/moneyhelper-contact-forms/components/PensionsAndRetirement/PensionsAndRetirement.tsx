import { H1 } from '@maps-react/common/components/Heading';
import useTranslation from '@maps-react/hooks/useTranslation';

import { StepComponent } from '../../lib/types';
import { OptionTypes } from '../OptionTypes';

export const PensionsAndRetirement: StepComponent = ({ errors }) => {
  const { t } = useTranslation();
  const contentKey = 'components.pensions-and-retirement';

  return (
    <div className="md:max-w-5xl">
      <H1
        className="mb-4 text-blue-800"
        data-testid="pensions-and-retirement-title"
      >
        {t(`${contentKey}.title`)}
      </H1>
      <OptionTypes
        errors={errors}
        optionsContentKey={`${contentKey}.form.flow.options`}
        formErrorContentKey={`${contentKey}.form.flow.error`}
      />
    </div>
  );
};
