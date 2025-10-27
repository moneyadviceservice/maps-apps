import { StoryFn } from '@storybook/nextjs';

import { ToolFeedback, ToolFeedbackProps } from './ToolFeedback';

const StoryProps = {
  title: 'Components/COMMON/ToolFeedback',
  component: ToolFeedback,
};

const Template: StoryFn<ToolFeedbackProps> = (args) => (
  <ToolFeedback {...args} />
);

export const Default = Template.bind({});
Default.args = {};

export const WithCustomClass = Template.bind({});
WithCustomClass.args = {
  className: 'custom-class',
};

export const WithCustomSurveyIds = Template.bind({});
WithCustomSurveyIds.args = {
  surveyIds: {
    production: {
      en: 'custom-en-prod-id',
      cy: 'custom-cy-prod-id',
    },
    development: {
      en: 'custom-en-dev-id',
      cy: 'custom-cy-dev-id',
    },
  },
};

export default StoryProps;
