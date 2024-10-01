import { StoryFn } from '@storybook/react';
import { ToolIntro, ToolIntroProps } from '.';

const StoryProps = {
  title: 'Components/COMMON/ToolIntro',
  component: ToolIntro,
};

const Template: StoryFn<ToolIntroProps> = (args) => <ToolIntro {...args} />;

export const Default = Template.bind({});
Default.args = {
  children:
    'This tool will help you explore the full market of credit products relevant to your situation',
};

export default StoryProps;
