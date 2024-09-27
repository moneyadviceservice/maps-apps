import { StoryFn } from '@storybook/react';
import { StepContainer, StepContainerProps } from './';

const StoryProps = {
  title: 'Components/TOOLS/StepContainer',
  component: StepContainer,
};
const Template: StoryFn<StepContainerProps> = (args) => (
  <StepContainer {...args} />
);

export const Default = Template.bind({});

Default.args = {
  children: <p>Some content</p>,
  backLink: 'https://back-link',
};

export const FormContainer = Template.bind({});

FormContainer.args = {
  children: <p>Some content</p>,
  backLink: 'https://back-link',
  action: '/api/submit',
  buttonText: 'Submit',
};

export default StoryProps;
