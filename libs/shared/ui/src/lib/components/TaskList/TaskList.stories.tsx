import { StoryFn } from '@storybook/react';
import { TaskList, TaskListProps } from '.';

const StoryProps = {
  title: 'Components/TaskList',
  component: TaskList,
};

const Template: StoryFn<TaskListProps> = (args) => <TaskList {...args} />;

export const Default = Template.bind({});
Default.args = {
  tasks: ['Task 1', 'Task 2', 'Task 3'],
  formAction: 'api/test',
  query: {
    language: 'en',
  },
};

export const LinksEnabled = Template.bind({});
LinksEnabled.args = {
  tasks: ['Task 1', 'Task 2', 'Task 3'],
  enableLinks: true,
  formAction: 'api/test',
  query: {
    language: 'en',
    t1: '4',
    t2: '3',
    t3: '2;',
  },
};

export const NotLaunched = Template.bind({});
NotLaunched.args = {
  tasks: ['Task 1', 'Task 2', 'Task 3'],
  formAction: 'api/test',
  notLaunched: true,
  query: {
    language: 'en',
  },
};

export default StoryProps;
