import React from 'react';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { SectionsRenderer } from '@maps-react/mhf/components/';

export const HoldingPage: React.FC = () => {
  const { tList } = useTranslation();
  const sections = tList('components.holding-page.sections');
  return (
    <div className="flex flex-col gap-4">
      <SectionsRenderer sections={sections} testIdPrefix="holding-page" />
    </div>
  );
};
