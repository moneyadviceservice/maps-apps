import useTranslation from '@maps-react/hooks/useTranslation';
import { SectionsRenderer } from '@maps-react/mhf/components';

import { StepName } from '../../lib/constants';
import { BookingStepComponent } from '../../lib/types';

export const ErrorComponent: BookingStepComponent = () => {
  const { tList } = useTranslation();
  const sections = tList(`components.${StepName.ERROR}.sections`);

  return (
    <div className="flex flex-col gap-4">
      <SectionsRenderer sections={sections} testIdPrefix={StepName.ERROR} />
    </div>
  );
};
