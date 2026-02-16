import { H5, InformationCallout } from '@maps-digital/shared/ui';

import useTranslation from '@maps-react/hooks/useTranslation';
import { SectionsRenderer } from '@maps-react/mhf/components';

export const HelpSidebar = () => {
  const { t, tList } = useTranslation();
  const sections = tList('components.sidebar.help.sections');

  return (
    <InformationCallout className="p-6" variant="withShadow">
      <H5 className="mb-4">{t('components.sidebar.help.title')}</H5>
      <SectionsRenderer sections={sections} testIdPrefix="help-sidebar" />
    </InformationCallout>
  );
};
