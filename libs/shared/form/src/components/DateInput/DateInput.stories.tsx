import { Meta, StoryFn } from '@storybook/react';

import { DateInput } from '.';

const StoryProps = {
  title: 'Components/FORM/DateInput',
  component: DateInput,
  argTypes: {
    showDayField: {
      control: 'boolean',
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
};

export const ErrorMonth = Template.bind({});
ErrorMonth.args = {
  ...Default.args,
  fieldErrors: { day: false, month: true, year: false },
};

export const ErrorYear = Template.bind({});
ErrorYear.args = {
  ...Default.args,
  fieldErrors: { day: false, month: false, year: true },
};

export const ErrorAll = Template.bind({});
ErrorAll.args = {
  ...Default.args,
  fieldErrors: { day: true, month: true, year: true },
};

export default StoryProps;
