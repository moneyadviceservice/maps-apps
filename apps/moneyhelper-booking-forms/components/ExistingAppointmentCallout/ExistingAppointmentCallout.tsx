import { H4 } from '@maps-digital/shared/ui';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { BookingStepComponent } from '../../lib/types';

export const ExistingAppointmentCallout: BookingStepComponent = ({ step }) => {
  const { t } = useTranslation();
  const contentKey = 'components.existing-appointment-callout';

  return (
    <div className="mt-6">
      <H4 className="mb-4">{t(`${contentKey}.title`)}</H4>
      <Markdown
        content={t(`${contentKey}.content`)}
        testId={`${step}-callout`}
      />
    </div>
  );
};
