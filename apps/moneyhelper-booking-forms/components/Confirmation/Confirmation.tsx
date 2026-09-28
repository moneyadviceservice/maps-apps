import { useTranslation } from '@maps-digital/shared/hooks';

import { SectionsRenderer } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

import { AppointmentSummaryCallout } from '../AppointmentSummaryCallout';

export const Confirmation: StepComponent = ({ entry, step }) => {
  if (!entry) {
    throw new TypeError('[Confirmation] Missing entry');
  }

  const { tList } = useTranslation();
  const contentKey = `components.${step}`;
  const sections = tList(`${contentKey}.sections`);

  return (
    <div className="flex flex-col gap-8 mt-[-32px]">
      <AppointmentSummaryCallout
        stepName={step}
        entry={entry}
        showDuration={true}
      />
      <SectionsRenderer
        sections={sections}
        testIdPrefix="confirmation-section"
        headingClassName="text-blue-700"
      />
    </div>
  );
};
