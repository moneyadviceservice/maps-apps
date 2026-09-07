import { H3, UrgentCallout } from '@maps-digital/shared/ui';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

export const ExistingAppointmentCallout = () => {
  const { t } = useTranslation();
  const componentKey = 'components.existing-appointment-callout';

  return (
    <UrgentCallout border="teal" variant="arrow">
      <H3 className="mb-4">{t(`${componentKey}.title`)}</H3>
      <Markdown
        content={t(`${componentKey}.content`)}
        testId="existing-appointment-callout"
      />
    </UrgentCallout>
  );
};
