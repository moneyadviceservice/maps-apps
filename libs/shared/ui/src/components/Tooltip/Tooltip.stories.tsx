import { StoryFn } from '@storybook/nextjs';

import { Tooltip, TooltipProps } from '.';

const StoryProps = {
  title: 'Components/COMMON/Tooltip',
  component: Tooltip,
};

const Template: StoryFn<TooltipProps> = (args) => (
  <div className="ml-72">
    <Tooltip {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  children:
    "This is a tooltip which adjusts it's position on the page if it is going to overflow the edge of the view port. Default tooltip content alignment is left aligned.",
};

export const CentreAligned = Template.bind({});
CentreAligned.args = {
  centerArrow: true,
  children:
    "This is a tooltip which adjusts it's position on the page if it is going to overflow the edge of the view port. The tooltip content is centred.",
};

export default StoryProps;
