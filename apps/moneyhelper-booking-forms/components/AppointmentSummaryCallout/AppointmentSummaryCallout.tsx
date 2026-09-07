import { Heading } from '@maps-react/common/components/Heading/';
import { InformationCallout } from '@maps-react/common/components/InformationCallout/';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Entry } from '@maps-react/mhf/types';
import { asString } from '@maps-react/mhf/utils';
import { Markdown } from '@maps-react/vendor/components/Markdown/Markdown';

import { StepName } from '../../lib/constants';
import {
  decodeSlotSelection,
  transformDate,
} from '../AppointmentDateTime/utils';
import { DetailsRow } from '../DetailsRow';

type AppointmentSummaryCalloutProps = {
  stepName: StepName;
  entry: Entry;
  showDuration?: boolean;
};

export const AppointmentSummaryCallout = ({
  stepName,
  entry,
  showDuration,
}: AppointmentSummaryCalloutProps) => {
  const { t } = useTranslation();

  const {
    flow,
    appointmentDate,
    appointmentSlotSelection,
    locale,
    accessOptionsRequest,
    referenceNumber,
  } = entry.data;

  const appointmentDetailsKey = 'common.appointment-details';
  const calloutKey = `components.${stepName}.callout`;
  const durationValueKey = accessOptionsRequest
    ? `${appointmentDetailsKey}.${accessOptionsRequest}.duration-value`
    : `${appointmentDetailsKey}.duration-value`;
  const formatValueKey = accessOptionsRequest
    ? `${appointmentDetailsKey}.${accessOptionsRequest}.format-value`
    : `${appointmentDetailsKey}.format-value`;

  const appointmentDateDisplay = transformDate(
    asString(appointmentDate),
    locale,
  );
  const { timeLabel } =
    decodeSlotSelection(asString(appointmentSlotSelection)) ?? {};

  return (
    <InformationCallout className="flex flex-col gap-4 bg-blue-700 md:gap-2 p-9">
      <Heading
        component="h1"
        className="mb-4 text-white"
        data-testid={`${stepName}-callout-title`}
      >
        {t(`${calloutKey}.title.${flow}`)}
      </Heading>
      <Markdown
        className={'text-xl text-white obfuscate md:text-2xl'}
        testId={`${stepName}-callout-content`}
        content={t(`${calloutKey}.content`, {
          referenceNumber: asString(referenceNumber),
        })}
      />
      <div>
        <DetailsRow
          className="py-4 text-white"
          label={t(`${calloutKey}.details.date.label`)}
          value={
            <Markdown
              className="mb-0 text-white"
              testId={`${stepName}-callout-row-date`}
              content={t(`${calloutKey}.details.date.value`, {
                appointmentDate: appointmentDateDisplay,
              })}
            />
          }
        />
        <DetailsRow
          className="py-4 text-white"
          label={t(`${calloutKey}.details.time.label`)}
          value={
            <Markdown
              className="mb-0 text-white"
              testId={`${stepName}-callout-row-time`}
              content={t(`${calloutKey}.details.time.value`, {
                appointmentTime: timeLabel ?? '',
              })}
            />
          }
        />
        {showDuration && (
          <DetailsRow
            className="py-4 text-white"
            label={t(`${appointmentDetailsKey}.duration-label`)}
            value={t(durationValueKey)}
          />
        )}
        <DetailsRow
          className="py-4 text-white"
          label={t(`${appointmentDetailsKey}.format-label`)}
          value={t(formatValueKey)}
        />
      </div>
    </InformationCallout>
  );
};
