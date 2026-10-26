import { NotificationBox } from '@maps-digital/shared/ui';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { SectionsRenderer } from '@maps-react/mhf/components';

import { BookingStepComponent } from '../../../lib/types';

export const PensionWiseNotEligible: BookingStepComponent = ({ step }) => {
  const { tList } = useTranslation();
  const contentKey = `components.${step}`;
  const sections = tList(`${contentKey}.sections`);
  const calloutSections = tList(`${contentKey}.callout.sections`);

  return (
    <div className="flex flex-col gap-4">
      <NotificationBox className="mt-4">
        <SectionsRenderer
          sections={calloutSections}
          testIdPrefix={`${step}-callout`}
        />
      </NotificationBox>
      <SectionsRenderer sections={sections} testIdPrefix={step} />
    </div>
  );
};
