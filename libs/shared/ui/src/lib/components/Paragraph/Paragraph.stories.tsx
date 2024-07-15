import { StoryFn } from '@storybook/react';
import { Paragraph, ParagraphProps } from '.';

const StoryProps = {
  title: 'Components/Paragraph',
  component: Paragraph,
};

const Template: StoryFn<ParagraphProps> = (args) => <Paragraph {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'This is a paragraph component',
};

export default StoryProps;
