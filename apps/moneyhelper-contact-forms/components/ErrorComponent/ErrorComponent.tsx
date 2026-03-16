import useTranslation from '@maps-react/hooks/useTranslation';
import { SectionsRenderer } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';

export const ErrorComponent: StepComponent = ({ flow }) => {
  const { tList } = useTranslation();
  const sections =
    flow === 'mhpd'
      ? tList('components.error.mhpd.sections')
      : tList('components.error.sections');

  return (
    <div className="flex flex-col gap-4">
      <SectionsRenderer
        sections={sections}
        testIdPrefix="error-component-section"
      />
    </div>
  );
};
