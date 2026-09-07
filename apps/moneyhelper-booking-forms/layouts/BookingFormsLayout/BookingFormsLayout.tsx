import { FormsLayout, FormsLayoutProps } from '@maps-react/mhf/layouts';

import { HelpSidebar, InformationSidebar } from '../../components';
import {
  INITIAL_STEP_JOURNEY_TYPE_MAP,
  JourneyType,
  SidebarType,
} from '../../lib/constants';
import { BookingEntry } from '../../lib/types';
import { displayBackButton } from '../../lib/utils';
import { routeConfig } from '../../routes/routeConfig';

type BookingFormsLayoutProps = FormsLayoutProps & {
  flow?: string;
  entry?: BookingEntry;
  hideSidebar?: boolean;
};

/**
 * BookingFormsLayout component
 * @param back - Optional back URL. If omitted, FormsLayout will not render a back link.
 * @param children - The component to render
 * @param errors - The errors array
 * @param step - The name of the current step
 * @param flow - The current flow of the booking process
 * @param entry - The booking entry data
 * @param heading - The heading for the layout. Defaults to `layout.${JourneyType.BASE}.title` if not provided.
 * @param title - The title for the layout. If not provided, the default title will be used.
 * @param hasFullWidth - Whether to display the layout in full width. Defaults to false.
 * @param hideSidebar - Whether to hide the sidebar. Defaults to false.
 * @param flow - The current flow of the booking process.
 * @param entry - The booking entry data.
 * @returns JSX.Element
 * Back-link behavior is controlled in two layers by design:
 *  1) passing/omitting `back` controls whether a back link can render at all,
 *  2) routeConfig hide flags can suppress it for a given step/edit mode.
 * Dedicated pages can opt into route-level behavior, or opt out by omitting `back`.
 */
export const BookingFormsLayout = ({
  back,
  children,
  errors,
  step,
  flow,
  entry,
  heading,
  title,
  hasFullWidth = false,
  hideSidebar = false,
}: BookingFormsLayoutProps) => {
  const { sidebarType, hideBackStep, hideBackStepInEditMode, hideTitle } =
    routeConfig[step] || {};

  // Determine the journey type based on the entry data or the initial step mapping
  const journeyType =
    entry?.data?.journeyType ??
    INITIAL_STEP_JOURNEY_TYPE_MAP[step] ??
    JourneyType.BASE;

  const resolvedHeading = heading ?? `layout.${journeyType}.title`;
  const hasTitle = !hideTitle;

  return (
    <FormsLayout
      step={step}
      back={
        displayBackButton(hideBackStep, hideBackStepInEditMode, entry)
          ? back
          : undefined
      }
      errors={errors}
      heading={resolvedHeading}
      title={title}
      hasTitle={hasTitle}
      hasFullWidth={hasFullWidth}
      sidebarType={sidebarType}
      sidebar={
        hideSidebar ? undefined : getSidebarContent(sidebarType, flow, entry)
      }
    >
      {children}
    </FormsLayout>
  );
};

/**
 * Get the sidebar content based on the sidebar type, flow, and entry
 * @param sidebarType
 * @param flow
 * @param entry
 * @returns
 */
export const getSidebarContent = (
  sidebarType: SidebarType | undefined,
  flow?: string,
  entry?: BookingEntry,
) => {
  switch (sidebarType) {
    case SidebarType.HELP:
      return <HelpSidebar />;
    case SidebarType.INFORMATION:
      return <InformationSidebar flow={flow} entry={entry} />;
    default:
      return undefined;
  }
};
