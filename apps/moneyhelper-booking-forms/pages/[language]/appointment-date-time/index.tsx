import { useEffect, useState } from 'react';

import { GetServerSideProps, NextPage } from 'next';

import { useTranslation } from '@maps-digital/shared/hooks';

import { H1, Heading } from '@maps-react/common/components/Heading/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon/Icon';
import { Container } from '@maps-react/core/components/Container/Container';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout/ToolPageLayout';
import { FormErrorCallout } from '@maps-react/mhf/components';
import {
  getStoreEntry,
  getStoreErrors,
  getStoreFlow,
} from '@maps-react/mhf/store';
import { PageProps } from '@maps-react/mhf/types';
import { getCurrentStep, getSessionId } from '@maps-react/mhf/utils';

import { AppointmentDateTime, InformationSidebar } from '../../../components';
import { runGuards } from '../../../guards';
import { AppErrorCode, StepName } from '../../../lib/constants';
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

  // Keep local error state aligned with latest server-provided errors.
  useEffect(() => {
    setActiveErrors(errors);
  }, [errors]);

  useBookingFormsAnalytics({ step, entry, errors, url });
  const { t } = useTranslation();
  // Dedicated page intentionally opts into routeConfig back-button policy.
  const back = displayBackButton(hideBackStep, hideBackStepInEditMode, entry)
    ? backStep
    : undefined;

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
            <AppointmentDateTime
              errors={activeErrors}
              entry={entry}
              onDateSelect={handleDateSelect}
              step={step}
            />
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
        backStep: StepName.PRE_APPOINTMENT, // Skip the transient loading step when navigating back
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
