import useTranslation from '@maps-react/hooks/useTranslation';
import { SectionsRenderer } from '@maps-react/mhf/components';

import { BookingStepComponent } from '../../lib/types';

export const ErrorComponent: BookingStepComponent = ({ step }) => {
  const { tList } = useTranslation();
  const sections = tList(`components.${step}.sections`);

  return (
    <div className="flex flex-col gap-4">
      <SectionsRenderer sections={sections} testIdPrefix={step} />
    </div>
  );
};
