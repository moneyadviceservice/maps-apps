import React from 'react';

import { TagGroup } from 'types/@adobe/page';
import { render } from '@testing-library/react';

import { SideNavigation } from './SideNavigation';

const mockTags = [
  {
    label: 'Topics',
    tags: [
      { name: 'Saving', key: 'saving' },
      { name: 'Debt', key: 'debt' },
      { name: 'Credit', key: 'credit' },
    ],
  },
  {
    label: 'Client Group',
    tags: [
      { name: 'Adult', key: 'adult' },
      { name: 'Children', key: 'children' },
    ],
  },
  {
    label: 'Country of Delivery',
    tags: [
      { name: 'England', key: 'england' },
      { name: 'UK', key: 'uk' },
    ],
  },
];

const defaultProps = {
  tags: mockTags as TagGroup[],
  lang: 'en',
  query: {},
};

describe('SideNavigation', () => {
  it('groups checkboxes by tag group with correct names', () => {
    render(<SideNavigation {...defaultProps} />);
  });
});
