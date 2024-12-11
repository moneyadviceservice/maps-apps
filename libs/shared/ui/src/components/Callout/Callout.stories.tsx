import { StoryFn } from '@storybook/react';

import { Callout, CalloutProps, CalloutVariant } from '.';

const StoryProps = {
  title: 'Components/COMMON/Callout',
  component: Callout,
};

const Template: StoryFn<CalloutProps> = (args) => <Callout {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Callout contents',
};

export const Warning = Template.bind({});
Warning.args = {
  children: 'Callout contents',
  variant: CalloutVariant.WARNING,
};

export const Positive = Template.bind({});
Positive.args = {
  children: 'Callout contents',
  variant: CalloutVariant.POSITIVE,
};

export const Negative = Template.bind({});
Negative.args = {
  children: 'Callout contents',
  variant: CalloutVariant.NEGATIVE,
};

export const Information = Template.bind({});
Information.args = {
  children: 'Callout contents',
  variant: CalloutVariant.INFORMATION,
};

export const White = Template.bind({});
White.args = {
  children: 'Callout contents',
  variant: CalloutVariant.WHITE,
};

export default StoryProps;
