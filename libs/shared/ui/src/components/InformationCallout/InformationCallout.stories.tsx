import { StoryFn } from '@storybook/nextjs';

import { InformationCallout } from '.';

const StoryProps = {
  title: 'Components/COMMON/InformationCallout',
  component: InformationCallout,
};

const Template: StoryFn<typeof InformationCallout> = (args) => (
  <InformationCallout {...args} className="p-6" />
);

export const Default = Template.bind({});
Default.args = {
  children: <div>Information Callout box</div>,
};

export const WithShadow = Template.bind({});
WithShadow.args = {
  children: <div>Information Callout box</div>,
  variant: 'withShadow',
};

export const WithDominantBorder = Template.bind({});
WithDominantBorder.args = {
  children: <div>Information Callout box</div>,
  variant: 'withDominantBorder',
};

export default StoryProps;
