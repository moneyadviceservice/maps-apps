import { useEffect, useMemo } from 'react';

import { GetServerSidePropsContext } from 'next';

import { AnalyticsData, useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';
import {
  buildErrorDetails,
  emitErrorEventIfAny,
} from '@maps-react/mhf/analytics';
import { Entry, FormError } from '@maps-react/mhf/types';
import { getCurrentStep } from '@maps-react/mhf/utils/getCurrentStep';
import { formatAnalyticsObject } from '@maps-react/utils/formatAnalyticsObject';
import { AnalyticsToolData } from '@maps-react/utils/formatAnalyticsObject/formatAnalyticsObject';

import { StepName } from '../constants';

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
  const { addEvent } = useAnalytics();

  // Use getCurrentStep if step is missing or empty
  const safeStep =
    (!step && url
      ? getCurrentStep({ resolvedUrl: url } as GetServerSidePropsContext)
      : step) || 'error';

  const pageTitle =
    safeStep.charAt(0).toUpperCase() + safeStep.replaceAll('-', ' ').slice(1); // make the pageTitle look
  const enquiryForm = 'enquiry-form';
  const stepIndex = entry ? entry.stepIndex + 1 : 0;
  const flow = entry?.data?.flow ?? '';
  const pageName = flow ? `${enquiryForm}-${flow}` : `${enquiryForm}`;

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
      categoryLevels: [enquiryForm],
      url,
    }),
    [tEn, tCy, stepIndex, safeStep, pageTitle, pageName, enquiryForm, url],
  );

  const analyticsData: AnalyticsData = useMemo(
    () => ({
      ...formatAnalyticsObject(zEn, analyticsToolData),
      event: 'pageLoadReact',
      tool: {
        ...formatAnalyticsObject(zEn, analyticsToolData).tool,
        toolCategory: flow,
        ...(referenceNumber &&
          safeStep === StepName.CONFIRMATION && {
            outcome: {
              ID: referenceNumber,
            },
          }),
      },
      ...(entry?.data.year &&
        safeStep === StepName.CONTACT_DETAILS && {
          demo: {
            bYear: parseInt(entry.data.year, 10),
          },
        }),
    }),
    [zEn, analyticsToolData, flow, referenceNumber, entry, safeStep],
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
