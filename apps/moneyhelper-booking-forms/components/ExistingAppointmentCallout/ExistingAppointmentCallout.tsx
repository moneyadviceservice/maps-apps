import { H3, UrgentCallout } from '@maps-digital/shared/ui';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { BookingStepComponent } from '../../lib/types';

export const ExistingAppointmentCallout: BookingStepComponent = ({ step }) => {
  const { t } = useTranslation();
  const contentKey = `components.${step}`;

  return (
    <UrgentCallout border="teal" variant="arrow">
      <H3 className="mb-4">{t(`${contentKey}.title`)}</H3>
      <Markdown
        content={t(`${contentKey}.content`)}
        testId={`${step}-callout`}
      />
    </UrgentCallout>
  );
};
