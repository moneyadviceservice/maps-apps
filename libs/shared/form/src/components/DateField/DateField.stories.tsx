import { Meta,StoryFn } from '@storybook/react';

import { DateField, DateFieldProps } from '.';

const StoryProps = {
  title: 'Components/FORM/DateField',
  component: DateField,
  argTypes: {
    threePartDate: {
      control: 'boolean'
    }
  }
} satisfies Meta<typeof DateField>;

const Template: StoryFn<DateFieldProps> = (args) => <DateField {...args} />;


const questions = [
  {
    title: 'Question Title',
    definition:
      "Question Definition",
    exampleText: 'Example Text',
    group: '',
    questionNbr: 1,
    subType: 'dayMonthYear',
    type: 'date',
    inputProps: {
      additionalLabels: {
        label1: 'Day',
        label2: 'Month',
        label3: 'Year',
      },
    },
    answers: [],
  },
]

export const Default = Template.bind({});
Default.args = {
  questions,
  currentStep: 1,
  threePartDate: true,
  fieldErrors: { day: false, month: false, year: false }
};

export const MonthYear = Template.bind({});
MonthYear.args = {
  questions,
  currentStep: 1,
  threePartDate: false,
  fieldErrors: { day: false, month: false, year: false }
};


export const ErrorDay = Template.bind({});
ErrorDay.args = {
  questions,
  currentStep: 1,
  threePartDate: true,
  fieldErrors: { day: true, month: false, year: false }
};

export const ErrorMonth = Template.bind({});
ErrorMonth.args = {
  questions,
  currentStep: 1,
  threePartDate: true,
  fieldErrors: { day: false, month: true, year: false }
};

export const ErrorYear = Template.bind({});
ErrorYear.args = {
  questions,
  currentStep: 1,
  threePartDate: true,
  fieldErrors: { day: false, month: false, year: true }
};

export const ErrorAll = Template.bind({});
ErrorAll.args = {
  questions,
  currentStep: 1,
  threePartDate: true,
  fieldErrors: { day: true, month: true, year: true }
};

export default StoryProps;
