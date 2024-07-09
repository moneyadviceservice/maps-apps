import { StoryFn } from '@storybook/react';
import { ToolPageLayout, ToolPageLayoutProps } from '.';
import { PhaseType } from '../../components/PhaseBanner';

const StoryProps = {
  title: 'Layouts/ToolPageLayout',
  component: ToolPageLayout,
};

const Template: StoryFn<ToolPageLayoutProps> = (args) => (
  <ToolPageLayout {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: 'ToolPageLayout contents',
};

export const WithSpanTitle = Template.bind({});
WithSpanTitle.args = {
  children: 'ToolPageLayout contents',
  title: 'This is a span title',
  titleTag: 'span',
};

export const WithBetaBanner = Template.bind({});
WithBetaBanner.args = {
  children: 'ToolPageLayout contents',
  phase: PhaseType.BETA,
};

export default StoryProps;
