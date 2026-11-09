import { StoryFn } from '@storybook/nextjs';

import { Header, HeaderProps } from '.';
import { headerLogoMock, headerNavigationMock } from './headerMocks';

const StoryProps = {
  title: 'Components/MPS/Header',
  component: Header,
};

const Template: StoryFn<HeaderProps> = (args) => <Header {...args} />;

export const Default = Template.bind({});
Default.args = {
  assetPath: '',
  logo: headerLogoMock,
  navigation: headerNavigationMock,
};

export default StoryProps;
