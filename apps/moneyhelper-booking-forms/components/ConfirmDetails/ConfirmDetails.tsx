import { Heading, Paragraph } from '@maps-digital/shared/ui';

import useTranslation from '@maps-react/hooks/useTranslation';
import { FormWrapper } from '@maps-react/mhf/components';
import { EntryData } from '@maps-react/mhf/types';
import { asString } from '@maps-react/mhf/utils';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import {
  AsyncAction,
  FLOW_NAME_LABEL_MAP,
  FlowName,
  FORM_FIELD_CONTENT_KEY,
  StepName,
} from '../../lib/constants';
import { BookingStepComponent } from '../../lib/types';
import {
  decodeSlotSelection,
  transformDate,
} from '../AppointmentDateTime/utils';
import { DetailsRow } from '../DetailsRow';

export const ConfirmDetails: BookingStepComponent = ({ step, entry }) => {
  if (!entry) {
    throw new TypeError('[ConfirmDetails] Missing entry');
  }
  const { t } = useTranslation();

  const {
    flow,
    locale,
    accessSupportRequest,
    appointmentDate,
    appointmentSlotSelection,
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    day,
    month,
    year,
    memorableWord,
    communicationMethod,
  } = entry.data;

  const contentKey = `components.${step}`;

  // Appointment details section
  const apppointmentDetailsSection = `${contentKey}.appointment-details`;
  const appointmentDateString = asString(appointmentDate);
  const appointmentDateDisplay = transformDate(appointmentDateString, locale);
  const appointmentFormat = accessSupportRequest
    ? `components.sidebar.information.details.${accessSupportRequest}.format-value`
    : `components.sidebar.information.details.format-value`;
  const { timeLabel } =
    decodeSlotSelection(asString(appointmentSlotSelection)) ?? {};

  // Your details section
  const yourDetailsSection = `${contentKey}.your-details`;
  const preferredMethods = Array.isArray(communicationMethod)
    ? communicationMethod
    : communicationMethod
    ? [communicationMethod]
    : [];
  const preferredMethodsDisplay = preferredMethods
    .map((method) =>
      t(
        `${yourDetailsSection}.${FORM_FIELD_CONTENT_KEY.communicationMethod}.value.${method}`,
      ),
    )
    .join(', ');

  const detailsRowClassName = 'border-transparent md:border-gray-300 text-sm';

  return (
    <section>
      <div className="flex flex-col gap-6 md:gap-8">
        <Paragraph className="mb-0">{t(`${contentKey}.content`)}</Paragraph>
        <div>
          <Heading
            level="h4"
            className="mb-4 text-blue-700 md:mb-6"
            data-testid="appointment-details-title"
          >
            {t(`${apppointmentDetailsSection}.title`)}
          </Heading>
          <div className="flex flex-col gap-6 md:block">
            <DetailsRow
              className={detailsRowClassName}
              labelClassName="font-bold"
              locale={locale}
              label={t(`${apppointmentDetailsSection}.topic`)}
              value={FLOW_NAME_LABEL_MAP[flow as FlowName]}
            />
            <DetailsRow
              className={detailsRowClassName}
              labelClassName="font-bold"
              locale={locale}
              label={t(`${apppointmentDetailsSection}.date`)}
              value={appointmentDateDisplay}
              changehref={StepName.APPOINTMENT_DATE_TIME}
              changeLabel={t('components.confirm-details.change-link')}
            />
            <DetailsRow
              className={detailsRowClassName}
              labelClassName="font-bold"
              locale={locale}
              label={t(`${apppointmentDetailsSection}.time`)}
              value={`${timeLabel} (GMT)`}
              changehref={StepName.APPOINTMENT_DATE_TIME}
              changeLabel={t('components.confirm-details.change-link')}
            />
            <DetailsRow
              className={detailsRowClassName}
              labelClassName="font-bold"
              locale={locale}
              label={t(`${apppointmentDetailsSection}.format`)}
              value={t(appointmentFormat)}
            />
            <AdjustmentRequestsRow
              t={t}
              label={t(
                `${apppointmentDetailsSection}.${FORM_FIELD_CONTENT_KEY.accessSupportRequest}.label`,
              )}
              changehref={StepName.ACCESS_SUPPORT}
              changeLabel={t('components.confirm-details.change-link')}
              apppointmentDetailsSection={apppointmentDetailsSection}
              data={entry.data}
              detailsRowClassName={detailsRowClassName}
            />
          </div>
        </div>
        <div>
          <Heading
            level="h4"
            className="mb-4 text-blue-700 md:mb-6"
            data-testid="your-details-title"
          >
            {t(`${yourDetailsSection}.title`)}
          </Heading>
          <div className="flex flex-col gap-6 md:block">
            <DetailsRow
              className={detailsRowClassName}
              labelClassName="font-bold"
              locale={locale}
              label={t(`${yourDetailsSection}.first-name`)}
              value={firstName}
              changehref={StepName.CONTACT_DETAILS}
              changeLabel={t('components.confirm-details.change-link')}
            />
            <DetailsRow
              className={detailsRowClassName}
              labelClassName="font-bold"
              locale={locale}
              label={t(`${yourDetailsSection}.last-name`)}
              value={lastName}
              changehref={StepName.CONTACT_DETAILS}
              changeLabel={t('components.confirm-details.change-link')}
            />
            <DetailsRow
              className={detailsRowClassName}
              labelClassName="font-bold"
              locale={locale}
              label={t(`${yourDetailsSection}.email-address`)}
              value={emailAddress}
              changehref={StepName.CONTACT_DETAILS}
              changeLabel={t('components.confirm-details.change-link')}
            />
            <DetailsRow
              className={detailsRowClassName}
              labelClassName="font-bold"
              locale={locale}
              label={t(`${yourDetailsSection}.phone-number`)}
              value={phoneNumber}
              changehref={StepName.CONTACT_DETAILS}
              changeLabel={t('components.confirm-details.change-link')}
            />
            <DetailsRow
              className={detailsRowClassName}
              labelClassName="font-bold"
              locale={locale}
              label={t(`${yourDetailsSection}.date-of-birth`)}
              value={`${day}/${month}/${year}`}
              changehref={StepName.CONTACT_DETAILS}
              changeLabel={t('components.confirm-details.change-link')}
            />
            <DetailsRow
              className={detailsRowClassName}
              labelClassName="font-bold"
              locale={locale}
              label={t(`${yourDetailsSection}.memorable-word`)}
              value={memorableWord}
              changehref={StepName.CONTACT_DETAILS}
              changeLabel={t('components.confirm-details.change-link')}
            />
            <DetailsRow
              className={detailsRowClassName}
              labelClassName="font-bold"
              locale={locale}
              label={t(
                `${yourDetailsSection}.${FORM_FIELD_CONTENT_KEY.communicationMethod}.label`,
              )}
              value={preferredMethodsDisplay}
              changehref={StepName.COMMUNICATION_PREFERENCES}
              changeLabel={t('components.confirm-details.change-link')}
            />
          </div>
        </div>
      </div>
      <FormWrapper
        step={step}
        nextStep={`${StepName.LOADING}/${AsyncAction.BOOKING_CREATE}`}
        isLastStep
        className="pt-0 md:pt-0"
      ></FormWrapper>
    </section>
  );
};

/**
 * Renders a row of adjustment requests with a label, content, and a change link.
 * @params AdjustmentRequestsRow
 * @returns JSX.Element | null
 */
type AdjustmentRequestsRow = {
  t: (key: string, params?: Record<string, string>) => string;
  label: string;
  changehref: string;
  changeLabel: string;
  apppointmentDetailsSection: string;
  data: EntryData;
  detailsRowClassName: string;
};

const AdjustmentRequestsRow = ({
  t,
  label,
  changehref,
  changeLabel,
  apppointmentDetailsSection,
  data,
  detailsRowClassName,
}: AdjustmentRequestsRow) => {
  const {
    locale,
    accessSupportStatus,
    accessSupportRequest,
    accessSupportCompanion,
    accessSupportDetails,
    accessSupportLanguageType,
    accessSupportLanguageOther,
  } = data;

  const language = asString(
    accessSupportLanguageType === 'other'
      ? accessSupportLanguageOther
      : accessSupportLanguageType,
  );

  // Show "None requested" text if accessSupportStatus is "none" or if none of the additional accessSupport fields were selected.
  const additionalRequests =
    accessSupportRequest || accessSupportCompanion || accessSupportDetails;
  const showNoneRequestedText =
    accessSupportStatus === 'none' || !additionalRequests;

  const content = (
    <div className="flex flex-col gap-4">
      {showNoneRequestedText && (
        <Paragraph className="mb-0">
          {t(
            `${apppointmentDetailsSection}.${FORM_FIELD_CONTENT_KEY.accessSupportRequest}.value.none`,
          )}
        </Paragraph>
      )}
      {accessSupportStatus !== 'none' && (
        <>
          {accessSupportRequest && (
            <Markdown
              className="mb-0"
              content={t(
                `${apppointmentDetailsSection}.${FORM_FIELD_CONTENT_KEY.accessSupportRequest}.value.${accessSupportRequest}`,
                {
                  accessSupportLanguageType: language,
                },
              )}
            />
          )}
          {accessSupportCompanion && (
            <Paragraph className="mb-0">
              {t(
                `${apppointmentDetailsSection}.${FORM_FIELD_CONTENT_KEY.accessSupportRequest}.value.${accessSupportCompanion}`,
              )}
            </Paragraph>
          )}

          {accessSupportDetails && (
            <Paragraph className="mb-0">{accessSupportDetails}</Paragraph>
          )}
        </>
      )}
    </div>
  );
  return (
    <DetailsRow
      className={detailsRowClassName}
      labelClassName="font-bold"
      locale={locale}
      label={label}
      value={content}
      changehref={changehref}
      changeLabel={changeLabel}
    />
  );
};
