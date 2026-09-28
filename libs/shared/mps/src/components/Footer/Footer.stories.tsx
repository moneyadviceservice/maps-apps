import { StoryFn } from '@storybook/nextjs';

import { Footer, FooterProps } from '.';
import { footerLinksMock } from './footerMocks';

const StoryProps = {
  title: 'Components/MPS/Footer',
  component: Footer,
};

const Template: StoryFn<FooterProps> = (args) => <Footer {...args} />;

export const Default = Template.bind({});
Default.args = {
  footerLinkGroup: footerLinksMock,
  copyright: '@ Copyright',
  reservedRights: 'All rights reserved',
};

export default StoryProps;
