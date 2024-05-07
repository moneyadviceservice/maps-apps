import { StoryFn } from '@storybook/react';
import { RichSection, RichSectionProps } from '.';
import mockData from './RichSection.mock.json';

const StoryProps = {
  title: 'Components/RichSection',
  component: RichSection,
};

const Template: StoryFn<RichSectionProps> = (args) => <RichSection {...args} />;

export const Default = Template.bind({});
Default.args = mockData;

export default StoryProps;
