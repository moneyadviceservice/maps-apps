import { StoryFn } from '@storybook/nextjs';

import { QuestionRadioButton, QuestionRadioButtonProps } from '.';

const StoryProps = {
  title: 'Components/FORM/QuestionRadioButton',
  component: QuestionRadioButton,
};

const Template: StoryFn<QuestionRadioButtonProps> = (args) => (
  <QuestionRadioButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: 'What is your favourite colour?',
  options: [
    { text: 'Red', value: 'red' },
    { text: 'Blue', value: 'blue' },
    { text: 'Green', value: 'green' },
  ],
  name: 'favouriteColour',
};

export const HorizontalLayout = Template.bind({});
HorizontalLayout.args = {
  ...Default.args,
  children: 'Label',
  options: [
    { text: 'Yes', value: 'yes' },
    { text: 'No', value: 'no' },
  ],
  horizontalLayout: true,
  name: 'horizontalOptions',
};

export const WithError = Template.bind({});
WithError.args = {
  ...Default.args,
  hasError: true,
  children: 'What is your favourite colour?',
  options: [
    { text: 'Red', value: 'red' },
    { text: 'Blue', value: 'blue' },
    { text: 'Green', value: 'green' },
  ],
  name: 'favouriteColour',
};

export default StoryProps;
