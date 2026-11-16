import { StoryFn } from '@storybook/nextjs';

import { RichTextAem, RichTextAemProps } from '.';
import { mapJsonRichText } from '../../utils/RenderRichText';
import mockData from './RichTextAem.mock.json';

const StoryProps = {
  title: 'Components/VENDOR/RichTextAem',
  component: RichTextAem,
};

const Template: StoryFn<RichTextAemProps> = (args) => <RichTextAem {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: mapJsonRichText(mockData.content.json),
};

export default StoryProps;
