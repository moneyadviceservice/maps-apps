import { useTranslation } from '@maps-digital/shared/hooks';

import { SectionsRenderer } from '@maps-react/mhf/components';

export const NoJsNotice = () => {
  const { tList } = useTranslation();

  const sections = tList(`components.no-js-notice.sections`);

  return <SectionsRenderer sections={sections} testIdPrefix="no-js-notice" />;
};
