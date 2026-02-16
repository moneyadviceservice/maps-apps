import { Callout, H2 } from '@maps-digital/shared/ui';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper, SectionsRenderer } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';
import { Markdown } from '@maps-react/vendor/components/Markdown/Markdown';

export const PensionWiseAppointment: StepComponent = ({ step }) => {
  const { t, tList } = useTranslation();
  const sections = tList('components.pension-wise-appointment.sections');
  const calloutSections = tList(
    'components.pension-wise-appointment.callout.sections',
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        <Markdown content={sections[0].content} className="mb-2" />
        <H2 className="text-blue-700">
          {t('components.pension-wise-appointment.sub-title')}
        </H2>
        <SectionsRenderer
          sections={sections.slice(1)}
          testIdPrefix="pension-wise-appointment"
        />
        <H2 className="text-blue-700">
          {t('components.pension-wise-appointment.callout.title')}
        </H2>
        <Callout>
          <SectionsRenderer
            sections={calloutSections}
            testIdPrefix="pension-wise-appointment-callout"
          />
        </Callout>
      </div>
      <FormWrapper step={step} className="md:pt-0"></FormWrapper>
    </>
  );
};
