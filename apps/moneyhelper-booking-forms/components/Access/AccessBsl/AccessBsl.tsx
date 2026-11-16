import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper, SectionsRenderer } from '@maps-react/mhf/components';

import { StepName } from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';

export const AccessBsl: BookingStepComponent = ({ step }) => {
  const { tList } = useTranslation();
  const contentKey = `components.${step}`;
  const sections = tList(`${contentKey}.sections`);

  return (
    <>
      <div className="flex flex-col gap-4">
        <SectionsRenderer
          sections={sections}
          testIdPrefix={step}
          headingClassName="text-blue-700"
        />
      </div>
      <FormWrapper
        step={step}
        nextStep={StepName.PRE_APPOINTMENT}
      ></FormWrapper>
    </>
  );
};
