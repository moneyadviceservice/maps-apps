import { Callout } from '@maps-digital/shared/ui';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { SectionsRenderer } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const PensionWiseNotEligible: StepComponent = () => {
  const { tList } = useTranslation();
  const sections = tList('components.pension-wise-not-eligible.sections');
  const calloutSections = tList(
    'components.pension-wise-not-eligible.callout.sections',
  );

  return (
    <div className="flex flex-col gap-4 mt-4">
      <Callout>
        <SectionsRenderer
          sections={calloutSections}
          testIdPrefix="pension-wise-not-eligible-callout"
        />
      </Callout>
      <SectionsRenderer
        sections={sections}
        testIdPrefix="pension-wise-not-eligible"
      />
    </div>
  );
};
