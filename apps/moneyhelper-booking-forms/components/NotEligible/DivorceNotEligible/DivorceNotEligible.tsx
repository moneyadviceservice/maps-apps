import { Callout } from '@maps-digital/shared/ui';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { SectionsRenderer } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const DivorceNotEligible: StepComponent = () => {
  const { tList } = useTranslation();
  const sections = tList('components.divorce-not-eligible.sections');
  const calloutSections = tList(
    'components.divorce-not-eligible.callout.sections',
  );

  return (
    <div className="flex flex-col gap-4">
      <Callout className="mt-4">
        <SectionsRenderer
          sections={calloutSections}
          testIdPrefix="divorce-not-eligible-callout"
        />
      </Callout>
      <SectionsRenderer
        sections={sections}
        testIdPrefix="divorce-not-eligible"
      />
    </div>
  );
};
