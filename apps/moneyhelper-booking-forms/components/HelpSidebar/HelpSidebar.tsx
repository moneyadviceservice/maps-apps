import { H5, InformationCallout } from '@maps-digital/shared/ui';

import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

export const HelpSidebar = () => {
  const { t } = useTranslation();

  return (
    <InformationCallout
      className="p-6 md:w-[300px]"
      variant="withShadow"
      data-testid="help-sidebar"
    >
      <H5 className="mb-4" data-testid="help-sidebar-title">
        {t('components.sidebar.help.title')}
      </H5>
      <Markdown
        content={t('components.sidebar.help.content')}
        testId="help-sidebar-content"
      />
    </InformationCallout>
  );
};
