import { StoryFn } from '@storybook/react';
import { LanguageSwitcher, LanguageSwitcherProps } from '.';

const StoryProps = {
  title: 'Components/LanguageSwitcher',
  component: LanguageSwitcher,
};

const Template: StoryFn<LanguageSwitcherProps> = (args) => (
  <div className="bg-blue-800 relative w-full h-10 p-10 flex items-center">
    <LanguageSwitcher {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  testId: 'language-switcher',
};

export default StoryProps;
