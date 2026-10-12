import { StoryFn } from '@storybook/nextjs';

import { QuestionForm, QuestionFormProps } from '.';
import mockData from './QuestionForm.mock.json';

const StoryProps = {
  title: 'Components/PWD/QuestionForm',
  component: QuestionForm,
};

const Template: StoryFn<QuestionFormProps> = (args) => (
  <QuestionForm {...args} />
);

export const Default = Template.bind({});
Default.args = {
  data: { ...mockData },
  formAction: 'api/test',
  saveReturnLink: true,
  query: {
    language: 'en',
  },
};

export default StoryProps;
