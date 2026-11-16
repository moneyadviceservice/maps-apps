import { StoryFn } from '@storybook/nextjs';

import { PhaseBanner, PhaseBannerProps, PhaseType } from '.';

const StoryProps = {
  title: 'Components/CORE/PhaseBanner',
  component: PhaseBanner,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/mq1ejNGzzFojAJP9AUuENk/Pension-Wise-Digital?type=design&node-id=863%3A257115&mode=design&t=SjiYIXkEZhtXphRS-1',
    },
  },
};

const Template: StoryFn<PhaseBannerProps> = (args) => <PhaseBanner {...args} />;

export const Default = Template.bind({});
Default.args = {
  link: 'https://www.link-to-feedback-form',
};

export const Alpha = Template.bind({});
Alpha.args = {
  phase: PhaseType.ALPHA,
  link: 'https://www.link-to-feedback-form',
};

export const NoLink = Template.bind({});

export const CustomText = Template.bind({});
CustomText.args = {
  text: 'This is a new service. We\u2019re still building and improving it.',
};

export default StoryProps;
