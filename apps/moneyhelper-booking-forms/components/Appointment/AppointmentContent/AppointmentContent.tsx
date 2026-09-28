import { H2, NotificationBox } from '@maps-digital/shared/ui';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { SectionsRenderer } from '@maps-react/mhf/components';
import { Markdown } from '@maps-react/vendor/components/Markdown/Markdown';

import { BookingStepComponent } from '../../../lib/types';

export const AppointmentContent: BookingStepComponent = ({ step }) => {
  const { t, tList } = useTranslation();
  const contentKey = `components.${step}`;
  const sections = tList(`${contentKey}.sections`);
  const calloutSections = tList(`${contentKey}.callout.sections`);

  return (
    <div className="flex flex-col gap-4">
      <Markdown content={sections[0].content} className="mb-2" />
      <H2 className="text-blue-700">{t(`${contentKey}.sub-title`)}</H2>
      <SectionsRenderer sections={sections.slice(1)} testIdPrefix={step} />
      <H2 className="text-blue-700">{t(`${contentKey}.callout.title`)}</H2>
      <NotificationBox>
        <SectionsRenderer
          sections={calloutSections}
          testIdPrefix={`${step}-callout`}
        />
      </NotificationBox>
    </div>
  );
};
