import { Callout } from '@maps-digital/shared/ui';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { SectionsRenderer } from '@maps-react/mhf/components';

import { StepName } from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';

export const DivorceNotEligible: BookingStepComponent = () => {
  const { tList } = useTranslation();
  const componentKey = `components.${StepName.DIVORCE_NOT_ELIGIBLE}`;
  const sections = tList(`${componentKey}.sections`);
  const calloutSections = tList(`${componentKey}.callout.sections`);

  return (
    <div className="flex flex-col gap-4">
      <Callout className="mt-4">
        <SectionsRenderer
          sections={calloutSections}
          testIdPrefix={`${StepName.DIVORCE_NOT_ELIGIBLE}-callout`}
        />
      </Callout>
      <SectionsRenderer
        sections={sections}
        testIdPrefix={StepName.DIVORCE_NOT_ELIGIBLE}
      />
    </div>
  );
};
