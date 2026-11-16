import { StoryFn } from '@storybook/nextjs';

import {
  NotificationBox,
  NotificationBoxProps,
  NotificationBoxVariant,
} from '.';

const StoryProps = {
  title: 'Components/COMMON/NotificationBox',
  component: NotificationBox,
};

const Template: StoryFn<NotificationBoxProps> = (args) => (
  <NotificationBox {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: 'Notification box contents',
};

export const Warning = Template.bind({});
Warning.args = {
  children: 'Notification box contents',
  variant: NotificationBoxVariant.WARNING,
};

export const Positive = Template.bind({});
Positive.args = {
  children: 'Notification box contents',
  variant: NotificationBoxVariant.POSITIVE,
};

export const Negative = Template.bind({});
Negative.args = {
  children: 'Notification box contents',
  variant: NotificationBoxVariant.NEGATIVE,
};

export const Information = Template.bind({});
Information.args = {
  children: 'Notification box contents',
  variant: NotificationBoxVariant.INFORMATION,
};

export const White = Template.bind({});
White.args = {
  children: 'Notification box contents',
  variant: NotificationBoxVariant.WHITE,
};

export const InformationMagenta = Template.bind({});
InformationMagenta.args = {
  children: 'Notification box contents',
  variant: NotificationBoxVariant.INFORMATION_MAGENTA,
};

export const InformationTeal = Template.bind({});
InformationTeal.args = {
  children: 'Notification box contents',
  variant: NotificationBoxVariant.INFORMATION_TEAL,
};

export const InformationBlue = Template.bind({});
InformationBlue.args = {
  children: 'Notification box contents',
  variant: NotificationBoxVariant.INFORMATION_BLUE,
};

export default StoryProps;
