import useTranslation from '@maps-react/hooks/useTranslation';

import { StepComponent } from '../../lib/types';
import { SectionsRenderer } from '../SectionsRenderer';

export const ErrorComponent: StepComponent = () => {
  const { tList } = useTranslation();
  const sections = tList('components.error.sections');

  return (
    <div className="flex flex-col gap-4">
      <SectionsRenderer sections={sections} testIdPrefix="about-scams" />
    </div>
  );
};
