import { useEffect, useMemo } from 'react';

import {
  AnalyticsData,
  EventErrorDetails,
  useAnalytics,
} from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';
import { formatAnalyticsObject } from '@maps-react/utils/formatAnalyticsObject';
import { AnalyticsToolData } from '@maps-react/utils/formatAnalyticsObject/formatAnalyticsObject';

import { StepName } from '../constants';
import { Entry, FormError } from '../types';

export type useContactFormsAnalyticsProps = {
  step: string;
  entry?: Entry;
  errors?: FormError;
  referenceNumber?: string;
  url: string | undefined;
};

/**
 * Custom hook to handle analytics for contact forms.
 * It captures page load events, errors, and formats the analytics data.
 * @param {string} - The current step in the contact form.
 * @param {Entry}  - The entry data for the contact form.
 * @param {FormError[]} - An array of errors encountered in the form.
 * @param {string} - The reference number for the contact form submission (confirmation page only).
 * @param {string} - The URL of the current page
 * @return {void}
 */
export function useContactFormsAnalytics({
  step,
  entry,
  errors,
  referenceNumber,
  url,
}: useContactFormsAnalyticsProps) {
  const { t: tEn, z: zEn } = useTranslation('en');
  const { t: tCy } = useTranslation('cy');
  const { addEvent, addPage } = useAnalytics();

  const pageTitle =
    step.replace(/-/g, ' ').charAt(0).toUpperCase() +
    step.replace(/-/g, ' ').slice(1); // make the pageTitle look nice
  const enquiryForm = 'enquiry-form';
  const stepIndex = entry ? entry.stepIndex + 1 : 0;
  const flow = entry?.data?.flow ?? '';
  const pageName = flow ? `${enquiryForm}-${flow}` : `${enquiryForm}`;

  const anylticsToolData: AnalyticsToolData = useMemo(
    () => ({
      tool: tEn('site.title'),
      toolCy: tCy('site.title'),
      toolStep: stepIndex.toString(),
      stepData: {
        pageName: step,
        pageTitle,
        stepName: step,
      },
      pageToolName: pageName,
      categoryLevels: [enquiryForm],
      url,
    }),
    [tEn, tCy, stepIndex, step, pageTitle, pageName, enquiryForm, url],
  );

  const analyticsData: AnalyticsData = useMemo(
    () => ({
      ...formatAnalyticsObject(zEn, anylticsToolData),
      event: 'pageLoadReact',
      tool: {
        ...formatAnalyticsObject(zEn, anylticsToolData).tool,
        toolCategory: flow,
        ...(referenceNumber &&
          step === StepName.CONFIRMATION && {
            outcome: {
              ID: referenceNumber,
            },
          }),
      },
      ...(entry?.data.year &&
        step === StepName.CONTACT_DETAILS && {
          demo: {
            bYear: parseInt(entry.data.year, 10),
          },
        }),
    }),
    [zEn, anylticsToolData, flow, referenceNumber, entry, step],
  );

  // Create the error event - if the step is 'error', we log the error message directly (passed in on error.tsx),
  const errorDetails: EventErrorDetails[] = useMemo(() => {
    if (!errors || Object.keys(errors).length === 0) return [];

    if (step === StepName.ERROR) {
      const errorMsg = errors['error-page']?.[0] ?? '';
      return [
        {
          reactCompType: tEn(`components.${step}.title`),
          reactCompName: 'error-page',
          errorMessage: errorMsg,
        },
      ];
    }

    // For all other steps, flatten all error keys for each field
    return Object.entries(errors).flatMap(([field, errorKeys]) =>
      errorKeys.map((errorKey) => ({
        reactCompType: tEn(`components.${step}.title`),
        reactCompName: field,
        errorMessage: tEn(`components.${step}.form.${errorKey}.error`),
      })),
    );
  }, [errors, tEn, step]);

  useEffect(() => {
    addEvent(analyticsData);
    if (errorDetails.length > 0) {
      addEvent({
        event: 'errorMessage',
        eventInfo: {
          errorDetails,
        },
      });
    }
  }, [addPage, addEvent, analyticsData, errorDetails, step, entry]);
}
