import { StoryFn } from '@storybook/nextjs';

import { SideFilterMock } from '../mocks';
import { SideFiltersMobile, SideFiltersType } from '..';

const StoryProps = {
  title: 'Components/MPS/SideFiltersMobile',
  component: SideFiltersMobile,
};

const Template: StoryFn<SideFiltersType> = (args) => (
  <SideFiltersMobile {...args} />
);

export const Default = Template.bind({});
Default.args = {
  tags: SideFilterMock,
  query: {},
  title: 'Filters',
  clearAllTitle: 'Clear all',
  searchTitle: 'Search by...',
  applyFiltersLabel: 'Apply filter',
  lang: 'en',
  className: 'lg:block',
};

export default StoryProps;
