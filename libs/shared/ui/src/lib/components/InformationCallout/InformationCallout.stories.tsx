import { StoryFn } from '@storybook/react';
import { InformationCallout } from '.';

const StoryProps = {
  title: 'Components/InformationCallout',
  component: InformationCallout,
};

const Template: StoryFn<typeof InformationCallout> = (args) => (
  <InformationCallout {...args} />
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

export default StoryProps;
