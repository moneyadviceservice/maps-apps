import useTranslation from '@maps-react/hooks/useTranslation';
import { SectionsRenderer } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const ErrorComponent: StepComponent = ({ step, flow }) => {
  const { tList } = useTranslation();
  const sections =
    flow === 'mhpd'
      ? tList(`components.${step}.mhpd.sections`)
      : tList(`components.${step}.sections`);

  return (
    <div className="flex flex-col gap-4">
      <SectionsRenderer
        sections={sections}
        testIdPrefix="error-component-section"
      />
    </div>
  );
};
