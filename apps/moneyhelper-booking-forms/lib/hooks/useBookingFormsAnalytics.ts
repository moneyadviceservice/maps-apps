import { useEffect, useMemo } from 'react';

import { GetServerSidePropsContext } from 'next';

import { AnalyticsData, useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';
import {
  buildErrorDetails,
  emitErrorEventIfAny,
} from '@maps-react/mhf/analytics';
import { FormError } from '@maps-react/mhf/types';
import { getCurrentStep } from '@maps-react/mhf/utils/getCurrentStep';
import { formatAnalyticsObject } from '@maps-react/utils/formatAnalyticsObject';
import { AnalyticsToolData } from '@maps-react/utils/formatAnalyticsObject/formatAnalyticsObject';

import { StepName } from '../constants';
import { BookingEntry } from '../types';

export type useBookingFormsAnalyticsProps = {
  step: string;
  entry?: BookingEntry;
  errors?: FormError;
  referenceNumber?: string;
  url: string | undefined;
};

/**
 * Custom hook to handle analytics for contact forms.
 * It captures page load events, errors, and formats the analytics data.
 * @param {string} - The current step in the contact form.
 * @param {entry}  - The entry data for the contact form.
 * @param {FormError[]} - An array of errors encountered in the form.
 * @param {string} - The reference number for the contact form submission (confirmation page only).
 * @param {string} - The URL of the current page
 * @return {void}
 */
export function useBookingFormsAnalytics({
  step,
  entry,
  errors,
  url,
}: useBookingFormsAnalyticsProps) {
  const { t: tEn, z: zEn } = useTranslation('en');
  const { t: tCy } = useTranslation('cy');
  const { addEvent } = useAnalytics();

  // Use getCurrentStep if step is missing or empty
  const safeStep =
    (!step && url
      ? getCurrentStep({ resolvedUrl: url } as GetServerSidePropsContext)
      : step) || 'error';

  const pageTitle =
    safeStep.charAt(0).toUpperCase() + safeStep.replaceAll('-', ' ').slice(1); // make the pageTitle look
  const appointmentForm = 'appointment-form';
  const stepIndex = entry ? entry.stepIndex + 1 : 0;
  const flow = entry?.data?.flow ?? '';
  const pageName = flow ? `${appointmentForm}-${flow}` : `${appointmentForm}`;

  const analyticsToolData: AnalyticsToolData = useMemo(
    () => ({
      tool: tEn('site.title'),
      toolCy: tCy('site.title'),
      toolStep: stepIndex.toString(),
      stepData: {
        pageName: safeStep,
        pageTitle,
        stepName: safeStep,
      },
      pageToolName: pageName,
      categoryLevels: [appointmentForm],
      url,
    }),
    [tEn, tCy, stepIndex, safeStep, pageTitle, pageName, appointmentForm, url],
  );

  const analyticsData: AnalyticsData = useMemo(
    () => ({
      ...formatAnalyticsObject(zEn, analyticsToolData),
      event: 'pageLoadReact',
      tool: {
        ...formatAnalyticsObject(zEn, analyticsToolData).tool,
        toolCategory: flow,
      },
    }),
    [zEn, analyticsToolData, flow],
  );

  // Create the error event - if the step is 'error', we log the error message directly (passed in on error.tsx),
  const errorDetails = useMemo(
    () =>
      buildErrorDetails({
        errors,
        step: safeStep,
        tEn,
        errorStepName: StepName.ERROR,
      }),
    [errors, safeStep, tEn],
  );

  useEffect(() => {
    addEvent(analyticsData);
    emitErrorEventIfAny(addEvent, errorDetails);
  }, [addEvent, analyticsData, errorDetails]);
}
