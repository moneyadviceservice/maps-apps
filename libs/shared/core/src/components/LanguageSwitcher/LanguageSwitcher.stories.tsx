import { StoryFn } from '@storybook/react';

import { LanguageSwitcher, LanguageSwitcherProps } from '.';

const StoryProps = {
  title: 'Components/CORE/LanguageSwitcher',
  component: LanguageSwitcher,
};

const Template: StoryFn<LanguageSwitcherProps> = (args) => (
  <div className="relative flex items-center w-full h-10 p-10 bg-blue-800">
    <LanguageSwitcher {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  testId: 'language-switcher',
};

export default StoryProps;
