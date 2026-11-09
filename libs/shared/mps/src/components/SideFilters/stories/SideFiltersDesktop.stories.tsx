import { StoryFn } from '@storybook/nextjs';

import { SideFilterMock } from '../mocks';
import { SideFiltersDesktop } from '../SideFiltersDesktop';
import { SideFiltersType } from '..';

const StoryProps = {
  title: 'Components/MPS/SideFiltersDesktop',
  component: SideFiltersDesktop,
};

const Template: StoryFn<SideFiltersType> = (args) => (
  <SideFiltersDesktop {...args} />
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
};

export default StoryProps;
