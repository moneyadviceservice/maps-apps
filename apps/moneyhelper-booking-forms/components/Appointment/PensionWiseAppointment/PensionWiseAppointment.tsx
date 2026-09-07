import { Callout, H2 } from '@maps-digital/shared/ui';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper, SectionsRenderer } from '@maps-react/mhf/components';
import { Markdown } from '@maps-react/vendor/components/Markdown/Markdown';

import { StepName } from '../../../lib/constants';
import { BookingStepComponent } from '../../../lib/types';

export const PensionWiseAppointment: BookingStepComponent = ({ step }) => {
  const { t, tList } = useTranslation();
  const componentKey = `components.${StepName.PENSION_WISE_APPOINTMENT}`;
  const sections = tList(`${componentKey}.sections`);
  const calloutSections = tList(`${componentKey}.callout.sections`);

  return (
    <>
      <div className="flex flex-col gap-4">
        <Markdown content={sections[0].content} className="mb-2" />
        <H2 className="text-blue-700">{t(`${componentKey}.sub-title`)}</H2>
        <SectionsRenderer
          sections={sections.slice(1)}
          testIdPrefix={StepName.PENSION_WISE_APPOINTMENT}
        />
        <H2 className="text-blue-700">{t(`${componentKey}.callout.title`)}</H2>
        <Callout>
          <SectionsRenderer
            sections={calloutSections}
            testIdPrefix={`${StepName.PENSION_WISE_APPOINTMENT}-callout`}
          />
        </Callout>
      </div>
      <FormWrapper
        step={step}
        nextStep={StepName.ELIGIBILITY_DEFINED_CONTRIBUTION}
      ></FormWrapper>
    </>
  );
};
