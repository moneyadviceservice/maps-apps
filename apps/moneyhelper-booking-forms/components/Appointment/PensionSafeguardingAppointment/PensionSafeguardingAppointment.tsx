import { NotificationBox } from '@maps-digital/shared/ui';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper, SectionsRenderer } from '@maps-react/mhf/components';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { StepName } from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';
import { ExistingAppointmentCallout } from '../../ExistingAppointmentCallout';

export const PensionSafeguardingAppointment: BookingStepComponent = ({
  step,
}) => {
  const { t, tList } = useTranslation();
  const contentKey = `components.${step}`;
  const sections = tList(`${contentKey}.sections`);
  const calloutSections = tList(`${contentKey}.callout.sections`);

  return (
    <>
      <div className="flex flex-col gap-4">
        <SectionsRenderer
          sections={sections}
          testIdPrefix={step}
          headingClassName="text-blue-700"
        />
        <NotificationBox>
          <SectionsRenderer
            sections={calloutSections}
            testIdPrefix={`${step}-callout`}
          />
        </NotificationBox>
        <Markdown content={t(`${contentKey}.footer.content`)} />
      </div>
      <FormWrapper
        step={step}
        nextStep={StepName.ELIGIBILITY_PENSION_PROVIDER}
      ></FormWrapper>
      <ExistingAppointmentCallout step={step} />
    </>
  );
};
