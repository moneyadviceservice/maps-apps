import { StoryFn } from '@storybook/nextjs';

import { EmergencyBanner, EmergencyBannerProps } from './EmergencyBanner';

const StoryProps = {
  title: 'Components/CORE/EmergencyBanner',
  component: EmergencyBanner,
  parameters: {
    layout: 'padded',
  },
};

const Template: StoryFn<EmergencyBannerProps> = (args) => (
  <EmergencyBanner {...args} />
);

export const Default = Template.bind({});
Default.args = {
  content: {
    en: 'The **stamp duty rates** have changed. We are updating the calculator.',
    cy: '[Welsh] The **stamp duty rates** have changed. We are updating the calculator.',
  },
};

export const Warning = Template.bind({});
Warning.args = {
  content: {
    en: '**Budget changes:** New rates apply from 1 April. [View details](#)',
    cy: '[Welsh] **Budget changes:** New rates apply from 1 April. [View details](#)',
    variant: 'warning',
  },
};

export const Information = Template.bind({});
Information.args = {
  content: {
    en: 'Calculator updated with latest **LBTT rates** for Scotland.',
    cy: '[Welsh] Calculator updated with latest **LBTT rates** for Scotland.',
    variant: 'information',
  },
};

export const Negative = Template.bind({});
Negative.args = {
  content: {
    en: '**Service unavailable:** We are fixing a calculation error.',
    cy: '[Welsh] **Service unavailable:** We are fixing a calculation error.',
    variant: 'negative',
  },
};

export const Positive = Template.bind({});
Positive.args = {
  content: {
    en: 'Calculator **fully restored** and working normally.',
    cy: '[Welsh] Calculator **fully restored** and working normally.',
    variant: 'positive',
  },
};

export default StoryProps;
