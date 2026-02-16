import { FormsLayout, FormsLayoutProps } from '@maps-react/mhf/layouts';

/**
 * ContactFormsLayout component
 * @param back - The name of the previous step
 * @param children - The component to render
 * @param errors - The errors array
 * @param step - The name of the current step
 * @param heading - The heading for the layout, defaults to 'layout.title'
 * @param title - The title for the layout, defaults to the translation of the step title
 * @param hasTitle - Whether to display the title, defaults to true
 * @param hasLayoutContent - Whether to display the layout content, defaults to true
 * @param hasFullWidth - Whether to use full width layout, defaults to false
 * @returns JSX.Element
 */
export const ContactFormsLayout = ({
  back,
  children,
  errors,
  step,
  heading,
  title,
  hasTitle = true,
  hasLayoutContent = true,
  hasFullWidth = false,
}: FormsLayoutProps) => {
  return (
    <FormsLayout
      step={step}
      back={back}
      errors={errors}
      heading={heading}
      hasLayoutContent={hasLayoutContent}
      hasFullWidth={hasFullWidth}
      title={title}
      hasTitle={hasTitle}
    >
      {children}
    </FormsLayout>
  );
};
