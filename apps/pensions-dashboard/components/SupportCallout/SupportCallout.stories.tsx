import React from 'react';

import { StoryFn } from '@storybook/react';

import { SupportCallout, SupportCalloutProps } from './SupportCallout';

const StoryProps = {
  title: 'Components/MHPD/SupportCallout',
  component: SupportCallout,
};

const Template: StoryFn<SupportCalloutProps> = (args) => (
  <SupportCallout {...args} />
);

export const WithoutExploreLink = Template.bind({});
WithoutExploreLink.args = {
  showExploreLink: false,
  showUnderstandLink: true,
  showReportLink: true,
};

export const WithoutUnderstandLink = Template.bind({});
WithoutUnderstandLink.args = {
  showExploreLink: true,
  showUnderstandLink: false,
  showReportLink: true,
};

export const WithoutReportLink = Template.bind({});
WithoutReportLink.args = {
  showExploreLink: true,
  showUnderstandLink: true,
  showReportLink: false,
};

export default StoryProps;
