import { SyntheticEvent, useEffect, useState } from 'react';

import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import { useTranslation } from '@maps-digital/shared/hooks';

import { H1, Heading } from '@maps-react/common/components/Heading/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon/Icon';
import { Container } from '@maps-react/core/components/Container/Container';
import useLanguage from '@maps-react/hooks/useLanguage';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout/ToolPageLayout';
import { FormErrorCallout } from '@maps-react/mhf/components';
import {
  getStoreEntry,
  getStoreErrors,
  getStoreFlow,
} from '@maps-react/mhf/store';
import { PageProps } from '@maps-react/mhf/types';
import { getCurrentStep, getSessionId } from '@maps-react/mhf/utils';
import { getBackStep } from '@maps-react/mhf/utils/getBackStep';

import { AppointmentDateTime, InformationSidebar } from '../../../components';
import { useAppointmentAvailability } from '../../../components/AppointmentDateTime/useAppointmentAvailability';
import { Loading } from '../../../components/Loading/Loading';
import { runGuards } from '../../../guards';
import { BookingFormsLayout } from '../../../layouts/BookingFormsLayout';
import { AppErrorCode, AsyncAction } from '../../../lib/constants';
import { useBookingFormsAnalytics } from '../../../lib/hooks';
import { BookingEntry } from '../../../lib/types';
import { displayBackButton, getErrorRedirect } from '../../../lib/utils';
import { routeConfig } from '../../../routes/routeConfig';

const Page: NextPage<PageProps> = ({
  step,
  backStep,
  errors,
  entry,
  url,
  flow,
}) => {
  const router = useRouter();
  const language = useLanguage();
  const { hideBackStep, hideBackStepInEditMode } = routeConfig[step] || {};
  const [activeErrors, setActiveErrors] = useState(errors);

  // Clear errors when the user selects a new date
  const handleDateSelect = () => {
    setActiveErrors((previousErrors) => {
      if (!previousErrors.appointmentSlotSelection) {
        return previousErrors;
      }

      const nextErrors = { ...previousErrors };
      delete nextErrors.appointmentSlotSelection;
      return nextErrors;
    });
  };

  // Fetch the appointment availability data from the API using a custom hook.
  const {
    data,
    isLoading,
    error: availabilityApiError,
  } = useAppointmentAvailability();

  /**
   * Prevent submit when no appointment slot is chosen, set an error state so both the callout and the radio button group show an error.
   * @param event - The form submit event
   */
  const handleSubmitCapture = (event: SyntheticEvent<HTMLDivElement>) => {
    const form =
      event.target instanceof HTMLFormElement ? event.target : undefined;

    if (!form) return;

    const formData = new FormData(form);
    const hasSelectedDate = Boolean(formData.get('appointmentDate'));
    const hasSelectedSlot = Boolean(formData.get('appointmentSlotSelection'));

    if (!hasSelectedDate || hasSelectedSlot) return;

    event.preventDefault();
    event.stopPropagation();
    setActiveErrors({
      appointmentSlotSelection: ['radio-button'],
    });
  };

  // Keep local error state aligned with latest server-provided errors.
  useEffect(() => {
    setActiveErrors(errors);
  }, [errors]);

  // Redirect to the error page if there is an API error fetching the appointment availability data.
  useEffect(() => {
    if (availabilityApiError) {
      const statusFromError = Number.parseInt(availabilityApiError.message, 10);
      const hasStatus = Number.isFinite(statusFromError);
      const errorPath = hasStatus
        ? `/${language}/error?status=${statusFromError}`
        : `/${language}/error`;

      void router.replace(errorPath);
    }
  }, [availabilityApiError, language, router]);

  useBookingFormsAnalytics({ step, entry, errors, url });
  const { t } = useTranslation();
  // Dedicated page intentionally opts into routeConfig back-button policy.
  const back = displayBackButton(hideBackStep, hideBackStepInEditMode, entry)
    ? backStep
    : undefined;

  // Render a loading state while the appointment availability data is being fetched or if there is an API error.
  if (isLoading || !data || availabilityApiError) {
    return (
      <BookingFormsLayout
        step={step}
        flow={flow}
        entry={entry}
        hideSidebar={true}
        hasFullWidth={true}
      >
        <Loading contentKey={AsyncAction.BOOKING_AVAILABILITY} />
      </BookingFormsLayout>
    );
  }

  return (
    <ToolPageLayout
      pageTitle={t('site.title')}
      noMargin={true}
      mainClassName="mt-8 mb-0 md:mb-8 text-gray-800"
    >
      <Container>
        <div className="flex flex-col gap-6 mb-6 md:mb-8 md:gap-8 md:max-w-[850px]">
          <Heading
            level="h4"
            component="p"
            className="text-blue-700 md:mb-4"
            data-testid="layout-title"
          >
            {t(`layout.title`)}
          </Heading>
          {back && (
            <div
              className="flex items-center text-magenta-500 group"
              data-testid="back-link"
            >
              <Icon
                type={IconType.CHEVRON_LEFT}
                className="text-magenta-500 group-hover:text-pink-800 w-[8px] h-[15px]"
                aria-hidden="true"
              />
              <a
                href={back}
                className="ml-2 underline tool-nav-prev group-hover:text-pink-800 group-hover:no-underline"
              >
                {t('site.back')}
              </a>
            </div>
          )}

          <FormErrorCallout errors={activeErrors} step={step} />
        </div>

        <div className="xl:flex xl:items-start xl:gap-12">
          <section className="flex-1 text-base xl:min-w-0">
            <H1 className="mb-2 md:mb-4" data-testid={`${step}-title`}>
              {t(`components.${step}.title`)}
            </H1>
            <div onSubmitCapture={handleSubmitCapture}>
              <AppointmentDateTime
                data={data}
                errors={activeErrors}
                entry={entry}
                onDateSelect={handleDateSelect}
                step={step}
              />
            </div>
          </section>

          <aside className="mt-6 xl:mt-0 xl:ml-auto" data-testid="sidebar">
            <InformationSidebar flow={flow} entry={entry} />
          </aside>
        </div>
      </Container>
    </ToolPageLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Run any guards for the current step
    await runGuards(context);

    // Get the session ID for the current user/session. This is used to retrieve the user's form entry data from the store.
    const key = getSessionId(context);

    return {
      props: {
        step: getCurrentStep(context),
        backStep: await getBackStep(context),
        errors: await getStoreErrors(context),
        flow: await getStoreFlow(context),
        entry: (await getStoreEntry(key)) as BookingEntry,
        url: context.resolvedUrl,
      },
    };
  } catch (error: unknown) {
    console.warn(`Error on appointment-date-time page:`, error); // DEBUG
    return {
      redirect: {
        destination: `${getErrorRedirect(context)}?status=${
          AppErrorCode.ROUTE_SETUP_FALLBACK
        }`,
        permanent: false,
      },
    };
  }
};

export default Page;
