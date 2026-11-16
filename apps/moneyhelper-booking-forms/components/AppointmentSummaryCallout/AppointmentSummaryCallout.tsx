import { Heading, Level } from '@maps-react/common/components/Heading/';
import { InformationCallout } from '@maps-react/common/components/InformationCallout/';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown/Markdown';

import { Appointment } from '../../lib/api';
import { BookingEntry } from '../../lib/types';
import { toTimeLabel, transformDate } from '../../lib/utils';
import { DetailsRow } from '../DetailsRow';

type AppointmentSummaryCalloutProps = {
  stepName: string;
  showDuration?: boolean;
  headingComponent?: Level;
  entry?: BookingEntry;
};

export type AppointmentSummaryCalloutData = {
  data: Appointment;
};

export const AppointmentSummaryCallout = ({
  stepName,
  showDuration,
  headingComponent = 'h2',
  entry,
}: AppointmentSummaryCalloutProps) => {
  if (!entry?.data) {
    return null;
  }

  const { t, locale } = useTranslation();

  const {
    appointmentId,
    startDateTime,
    appointmentType,
    medium,
    isBslRequired,
    isInterpreterRequired,
  } = entry.data;

  const contentKey = 'common.appointment-details';
  const calloutKey = `components.${stepName}.callout`;

  const formatValueKey =
    medium === 'video'
      ? `${contentKey}.bsl-interpreter.format-value`
      : `${contentKey}.format-value`;
  let durationValueKey: string;

  if (isBslRequired || isInterpreterRequired) {
    durationValueKey = `${contentKey}.foreign-language-interpreter.duration-value`;
  } else {
    durationValueKey = `${contentKey}.duration-value`;
  }

  const appointmentDate = startDateTime
    ? transformDate(String(startDateTime.slice(0, 10)), locale)
    : '';
  const appointmentTime = startDateTime
    ? toTimeLabel(String(startDateTime))
    : '';

  return (
    <InformationCallout className="flex flex-col gap-4 bg-blue-700 md:gap-2 p-9">
      <Heading
        component={headingComponent}
        level="h2"
        className="mb-4 text-white"
        data-testid={`${stepName}-callout-title`}
      >
        {t(`${calloutKey}.title.${appointmentType}`)}
      </Heading>
      <Markdown
        className={'text-xl text-white obfuscate md:text-2xl'}
        testId={`${stepName}-callout-content`}
        content={t(`${calloutKey}.content`, {
          appointmentId: String(appointmentId),
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
                appointmentDate,
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
                appointmentTime,
              })}
            />
          }
        />
        {showDuration && (
          <DetailsRow
            className="py-4 text-white"
            label={t(`${contentKey}.duration-label`)}
            value={t(durationValueKey)}
          />
        )}
        <DetailsRow
          className="py-4 text-white"
          label={t(`${contentKey}.format-label`)}
          value={t(formatValueKey)}
        />
      </div>
    </InformationCallout>
  );
};
