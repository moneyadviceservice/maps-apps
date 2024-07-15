import { StoryFn } from '@storybook/react';
import { Button } from '.';
import { Icon, IconType } from '../../components/Icon';

const StoryProps = {
  title: 'Components/Button',
  component: Button,
};

const Template: StoryFn<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: 'Primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: 'Secondary',
  variant: 'secondary',
};

export const Loading = Template.bind({});
Loading.args = {
  children: 'Loading',
  iconLeft: <Icon type={IconType.SPINNER} className="animate-spin" />,
  variant: 'loading',
};

export const IconLeft = Template.bind({});
IconLeft.args = {
  children: 'Get Started',
  iconLeft: <Icon type={IconType.CHEVRON} />,
};

export const IconRight = Template.bind({});
IconRight.args = {
  children: 'Get Started',
  iconRight: <Icon type={IconType.CHEVRON} />,
};

export const Link = Template.bind({});
Link.args = {
  children: 'Edit',
  iconLeft: <Icon type={IconType.EDIT} />,
  variant: 'link',
};

export const AsAnchor = Template.bind({});
AsAnchor.args = {
  children: 'Back',
  iconLeft: <Icon type={IconType.CHEVRON_LEFT} />,
  variant: 'link',
  href: 'https://www.moneyhelper.org.uk/en',
  as: 'a',
};

export const AsButtonWithWhiteText = Template.bind({});
AsButtonWithWhiteText.args = {
  children: 'Cookie preferences',
  variant: 'whiteLink',
  as: 'button',
};

export default StoryProps;
