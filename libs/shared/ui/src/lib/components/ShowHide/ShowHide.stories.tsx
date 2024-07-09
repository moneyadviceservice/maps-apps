import { StoryFn } from '@storybook/react';
import { ShowHide, ShowHideProps } from '.';
const StoryProps = {
  title: 'Components/ShowHide',
  component: ShowHide,
};
const Template: StoryFn<ShowHideProps> = (args) => <ShowHide {...args} />;
export const Default = Template.bind({});
Default.args = {
  children: 'Contents of the show hide component',
};
export default StoryProps;
