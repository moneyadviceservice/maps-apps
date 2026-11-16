import { StoryFn } from '@storybook/nextjs';

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
  showContactLink: true,
};

export const WithoutUnderstandLink = Template.bind({});
WithoutUnderstandLink.args = {
  showExploreLink: true,
  showUnderstandLink: false,
  showContactLink: true,
};

export const WithoutContactLink = Template.bind({});
WithoutContactLink.args = {
  showExploreLink: true,
  showUnderstandLink: true,
  showContactLink: false,
};

export const AllLinksVisible = Template.bind({});
AllLinksVisible.args = {
  showExploreLink: true,
  showUnderstandLink: true,
  showContactLink: true,
};

export default StoryProps;
