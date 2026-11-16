import { Meta, StoryFn } from '@storybook/react';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';

import { DateInput } from '.';
const StoryProps = {
  title: 'Components/FORM/DateInput',
  component: DateInput,
  tags: ['molecule'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zOXKbKzt2dhBi1ZOauyUKA/Component-Library---BETA---WIP-?node-id=3750-2379&m=dev',
    },

    docs: {
      description: {
        component: `
The DateInput component is a form input used for capturing date information from users. It supports both single date inputs (day, month, year) and partial date inputs (month and year only). Default values must be provided in the format of 'DD-MM-YYYY' for all fields or 'MM-YYYY' when the day field is not shown.

It allows for error handling on individual fields (day, month, year) and can display error messages accordingly. The component also supports additional features such as hint text, legends, and the ability to render custom children components (e.g., an ExpandableSection for additional information).

Error messages can be displayed outside of the component (to support progressive enhancement) or passed in as the 'error' string prop. There is an option to wrap the entire component with an Errors component for consistent styling of error states via the hasErrorWrapper prop. (This is optional as some usages may want to handle error styling differently or not use the Errors component at all).

**Used Components:**
- [NumberInput](?path=/docs/components-tools-numberinput--docs)
- [Errors](?path=/docs/components-common-errors--docs)`,
      },
    },
    argTypes: {
      showDayField: {
        control: 'boolean',
      },
    },
  },
} satisfies Meta<typeof DateInput>;

const Template: StoryFn<typeof DateInput> = (args) => <DateInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  showDayField: true,
  defaultValues: '03-12-2025',
  fieldErrors: { day: false, month: false, year: false },
  legend: 'What is your date of birth?',
  hintText: 'For example, 27 3 1985',
};

export const MonthYear = Template.bind({});
MonthYear.args = {
  showDayField: false,
  defaultValues: '03-2025',
  fieldErrors: { day: false, month: false, year: false },
  legend: 'When will you be made redundant?',
  hintText: 'For example, 3 2025',
};

export const ErrorDay = Template.bind({});
ErrorDay.args = {
  ...Default.args,
  fieldErrors: { day: true, month: false, year: false },
  error: 'Error: message goes here',
};

export const ErrorMonth = Template.bind({});
ErrorMonth.args = {
  ...Default.args,
  fieldErrors: { day: false, month: true, year: false },
  error: 'Error: message goes here',
};

export const ErrorYear = Template.bind({});
ErrorYear.args = {
  ...Default.args,
  fieldErrors: { day: false, month: false, year: true },
  error: 'Error: message goes here',
};

export const ErrorAll = Template.bind({});
ErrorAll.args = {
  ...Default.args,
  fieldErrors: { day: true, month: true, year: true },
  error: 'Error: message goes here',
};

export const WithErrorWrapper = Template.bind({});
WithErrorWrapper.args = {
  ...Default.args,
  fieldErrors: { day: true, month: false, year: false },
  error: 'Error: message goes here',
  hasErrorWrapper: true,
};

export const WithLegendShown = Template.bind({});
WithLegendShown.args = {
  ...Default.args,
  defaultValues: '',
  hideLegend: false,
};

export const WithChildren = Template.bind({});
WithChildren.args = {
  ...Default.args,
  defaultValues: '',
  children: (
    <ExpandableSection title="Additional information" className="mt-2">
      <p>This is some additional content inside the DateInput component.</p>
    </ExpandableSection>
  ),
};

export const WithChildrenAndError = Template.bind({});
WithChildrenAndError.args = {
  ...Default.args,
  defaultValues: '',
  fieldErrors: { day: true, month: true, year: true },
  error: 'Error: message goes here',
  hasErrorWrapper: true,
  children: (
    <ExpandableSection title="Additional information" className="mt-2">
      <p>This is some additional content inside the DateInput component.</p>
    </ExpandableSection>
  ),
};

export default StoryProps;
