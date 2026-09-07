import { useTranslation } from '@maps-digital/shared/hooks';

import { SectionsRenderer } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

import { StepName } from '../../lib/constants';
import { AppointmentSummaryCallout } from '../AppointmentSummaryCallout';

export const Confirmation: StepComponent = ({ entry }) => {
  if (!entry) {
    throw new TypeError('[Confirmation] Missing entry');
  }

  const { tList } = useTranslation();
  const componentKey = `components.${StepName.CONFIRMATION}`;
  const sections = tList(`${componentKey}.sections`);

  return (
    <div className="flex flex-col gap-8 mt-[-32px]">
      <AppointmentSummaryCallout
        stepName={StepName.CONFIRMATION}
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
