import { Callout } from '@maps-digital/shared/ui';

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
  const componentKey = `components.${StepName.PENSION_SAFEGUARDING_APPOINTMENT}`;
  const sections = tList(`${componentKey}.sections`);
  const calloutSections = tList(`${componentKey}.callout.sections`);

  return (
    <>
      <div className="flex flex-col gap-4">
        <SectionsRenderer
          sections={sections}
          testIdPrefix={StepName.PENSION_SAFEGUARDING_APPOINTMENT}
          headingClassName="text-blue-700"
        />
        <Callout>
          <SectionsRenderer
            sections={calloutSections}
            testIdPrefix={`${StepName.PENSION_SAFEGUARDING_APPOINTMENT}-callout`}
          />
        </Callout>
        <Markdown content={t(`${componentKey}.footer.content`)} />
      </div>
      <FormWrapper
        step={step}
        nextStep={StepName.ELIGIBILITY_PENSION_PROVIDER}
      ></FormWrapper>
      <ExistingAppointmentCallout />
    </>
  );
};
