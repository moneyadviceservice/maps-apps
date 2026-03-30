import { Callout } from '@maps-digital/shared/ui';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { SectionsRenderer } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const PensionLossNotEligible: StepComponent = () => {
  const { tList } = useTranslation();
  const sections = tList('components.pension-loss-not-eligible.sections');
  const calloutSections = tList(
    'components.pension-loss-not-eligible.callout.sections',
  );

  return (
    <div className="flex flex-col gap-4">
      <Callout className="mt-4">
        <SectionsRenderer
          sections={calloutSections}
          testIdPrefix="pension-loss-not-eligible-callout"
        />
      </Callout>
      <SectionsRenderer
        sections={sections}
        testIdPrefix="pension-loss-not-eligible-section"
      />
    </div>
  );
};
