import { Callout, H2 } from '@maps-digital/shared/ui';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { FormWrapper, SectionsRenderer } from '@maps-react/mhf/components';
import { StepComponent } from '@maps-react/mhf/types';
import { Markdown } from '@maps-react/vendor/components/Markdown/Markdown';

import { FlowName } from '../../../lib/constants';

export const SelfEmployedAppointment: StepComponent = ({ step }) => {
  const { t, tList } = useTranslation();
  const componentKey = 'components.self-employed-appointment';
  const sections = tList(`${componentKey}.sections`);
  const calloutSections = tList(`${componentKey}.callout.sections`);

  return (
    <>
      <div className="flex flex-col gap-4">
        <Markdown content={sections[0].content} className="mb-2" />
        <H2 className="text-blue-700">{t(`${componentKey}.sub-title`)}</H2>
        <SectionsRenderer
          sections={sections.slice(1)}
          testIdPrefix="self-employed-appointment"
        />
        <H2 className="text-blue-700">{t(`${componentKey}.callout.title`)}</H2>
        <Callout>
          <SectionsRenderer
            sections={calloutSections}
            testIdPrefix="self-employed-appointment-callout"
          />
        </Callout>
      </div>
      <FormWrapper step={step}>
        <input type="hidden" name="mainFlow" value={FlowName.SELF_EMPLOYED} />
      </FormWrapper>
    </>
  );
};
