import { StoryFn } from '@storybook/nextjs';

import { Paragraph, ParagraphProps } from '.';

const StoryProps = {
  title: 'Components/COMMON/Paragraph',
  component: Paragraph,
};

const Template: StoryFn<ParagraphProps> = (args) => <Paragraph {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'This is a paragraph component',
};

export default StoryProps;
