import { StoryFn } from '@storybook/react';
import { Contact } from '.';

const StoryProps = {
  title: 'Components/VENDOR/Contact',
  component: Contact,
};

const Template: StoryFn = () => {
  return (
    <div className="flex flex-col h-screen">
      <Contact />
    </div>
  );
};

export const Default = Template.bind({});

export default StoryProps;
