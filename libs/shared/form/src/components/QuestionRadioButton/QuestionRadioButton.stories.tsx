import { StoryFn } from '@storybook/react';

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

export default StoryProps;
