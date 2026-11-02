import { StoryFn } from '@storybook/nextjs';

import AccountPagination, { PaginationProps } from './Pagination';

const StoryProps = {
  title: 'Components/COMMON/Pagination',
  component: AccountPagination,
  decorators: [
    (Story: StoryFn) => (
      <div style={{ padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    nextjs: {
      router: {
        query: { p: '3' },
      },
    },
  },
};

const Template: StoryFn<PaginationProps> = (args) => (
  <AccountPagination {...args} />
);

export const Default = Template.bind({});
Default.args = {
  page: 3,
  totalPages: 25,
  pageRange: 1,
  startIndex: 20,
  endIndex: 30,
  totalItems: 242,
};

export const FirstPage = Template.bind({});
FirstPage.args = {
  page: 1,
  totalPages: 25,
  pageRange: 1,
  startIndex: 0,
  endIndex: 10,
  totalItems: 242,
};
FirstPage.parameters = {
  nextjs: {
    router: {
      query: { p: '1' },
    },
  },
};

export const LastPage = Template.bind({});
LastPage.args = {
  page: 25,
  totalPages: 25,
  pageRange: 1,
  startIndex: 240,
  endIndex: 242,
  totalItems: 242,
};
LastPage.parameters = {
  nextjs: {
    router: {
      query: { p: '25' },
    },
  },
};

export const FewPages = Template.bind({});
FewPages.args = {
  page: 2,
  totalPages: 5,
  pageRange: 1,
  startIndex: 10,
  endIndex: 20,
  totalItems: 50,
};
FewPages.parameters = {
  nextjs: {
    router: {
      query: { p: '2' },
    },
  },
};

export const SinglePage = Template.bind({});
SinglePage.args = {
  page: 1,
  totalPages: 1,
  pageRange: 1,
  startIndex: 0,
  endIndex: 10,
  totalItems: 5,
};
SinglePage.parameters = {
  nextjs: {
    router: {
      query: { p: '1' },
    },
  },
};

export const WithMorePageRange = Template.bind({});
WithMorePageRange.args = {
  page: 10,
  totalPages: 30,
  pageRange: 2,
  startIndex: 90,
  endIndex: 100,
  totalItems: 300,
};
WithMorePageRange.parameters = {
  nextjs: {
    router: {
      query: { p: '10' },
    },
  },
};

export default StoryProps;
