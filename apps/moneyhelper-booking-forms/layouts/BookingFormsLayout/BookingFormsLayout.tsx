import { FormsLayout, FormsLayoutProps } from '@maps-react/mhf/layouts';

import { HelpSidebar, InformationSidebar } from '../../components';
import { SidebarType } from '../../lib/constants';
import { routeConfig } from '../../routes/routeConfig';

type BookingFormsLayoutProps = FormsLayoutProps & {
  flow?: string;
};

/**
 * BookingFormsLayout component
 * @param back - The name of the previous step
 * @param children - The component to render
 * @param errors - The errors array
 * @param step - The name of the current step
 * @param heading - The heading for the layout, defaults to 'layout.title'
 * @returns JSX.Element
 */
export const BookingFormsLayout = ({
  back,
  children,
  errors,
  step,
  flow,
  heading = 'layout.title',
  title,
  hasTitle = true,
  hasFullWidth = false,
}: BookingFormsLayoutProps) => {
  const sidebarConfig = routeConfig[step]?.sidebar;

  return (
    <FormsLayout
      step={step}
      back={back}
      errors={errors}
      heading={heading}
      title={title}
      hasTitle={hasTitle}
      hasFullWidth={hasFullWidth}
      sidebar={getSidebarContent(sidebarConfig, flow)}
    >
      {children}
    </FormsLayout>
  );
};

export const getSidebarContent = (
  sidebarType: SidebarType | undefined,
  flow?: string,
) => {
  switch (sidebarType) {
    case SidebarType.HELP:
      return <HelpSidebar />;
    case SidebarType.INFORMATION:
      return <InformationSidebar flow={flow} />;
    default:
      return undefined;
  }
};
