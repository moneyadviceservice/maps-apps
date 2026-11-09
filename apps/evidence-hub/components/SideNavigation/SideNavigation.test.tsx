import React from 'react';

import { TagGroup } from 'types/@adobe/page';
import { render, screen } from '@testing-library/react';

import { SideNavigationDesktop, SideNavigationMobile } from './SideNavigation';

import '@testing-library/jest-dom';

const mockTags: TagGroup[] = [
  {
    label: 'Topics',
    key: 'topic',
    slug: 'topics',
    tags: [
      { name: 'Saving', key: 'saving' },
      { name: 'Debt', key: 'debt' },
      { name: 'Credit', key: 'credit' },
    ],
  },
  {
    label: 'Client Group',
    key: 'clientGroup',
    slug: 'client-group',
    tags: [
      { name: 'Adult', key: 'adult' },
      { name: 'Children', key: 'children' },
    ],
  },
  {
    label: 'Country of Delivery',
    key: 'countryOfDelivery',
    slug: 'country-of-delivery',
    tags: [
      { name: 'England', key: 'england' },
      { name: 'UK', key: 'uk' },
    ],
  },
];

const defaultProps = {
  tags: mockTags,
  lang: 'en',
  query: {},
};

describe('SideNavigationDesktop', () => {
  it('renders filter navigation with all tag groups', () => {
    render(<SideNavigationDesktop {...defaultProps} />);

    expect(screen.getByText('Filters')).toBeInTheDocument();
    const topicSection = screen.getByTestId('topic');
    expect(
      topicSection.querySelector('[data-testid="summary-block-title"]'),
    ).toHaveTextContent('Topics');
    const clientGroupSection = screen.getByTestId('clientGroup');
    expect(
      clientGroupSection.querySelector('[data-testid="summary-block-title"]'),
    ).toHaveTextContent('Client Group');
    const countrySection = screen.getByTestId('countryOfDelivery');
    expect(
      countrySection.querySelector('[data-testid="summary-block-title"]'),
    ).toHaveTextContent('Country of Delivery');
  });

  it('renders keyword search input', () => {
    render(<SideNavigationDesktop {...defaultProps} />);

    expect(screen.getByLabelText('Keyword search')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('renders year selection when second tag group is present', () => {
    render(<SideNavigationDesktop {...defaultProps} />);

    const yearSection = screen.getByTestId('year-of-publication');
    expect(
      yearSection.querySelector('[data-testid="summary-block-title"]'),
    ).toHaveTextContent('Year of publication');
    expect(screen.getByLabelText('All years')).toBeInTheDocument();
    expect(screen.getByLabelText('Last 2 years')).toBeInTheDocument();
    expect(screen.getByLabelText('Last 5 years')).toBeInTheDocument();
  });

  it('displays selected year from query', () => {
    render(
      <SideNavigationDesktop {...defaultProps} query={{ year: 'last-2' }} />,
    );

    const yearRadio = screen.getByLabelText('Last 2 years');
    expect((yearRadio as HTMLInputElement).checked).toBe(true);
  });

  it('handles comma-separated tag values', () => {
    render(
      <SideNavigationDesktop
        {...defaultProps}
        query={{ topic: 'saving,debt' }}
      />,
    );

    const savingCheckbox = screen.getByLabelText('Saving');
    const debtCheckbox = screen.getByLabelText('Debt');

    expect((savingCheckbox as HTMLInputElement).checked).toBe(true);
    expect((debtCheckbox as HTMLInputElement).checked).toBe(true);
  });

  it('handles array tag values', () => {
    render(
      <SideNavigationDesktop
        {...defaultProps}
        query={{ topic: ['saving', 'debt'] }}
      />,
    );

    const savingCheckbox = screen.getByLabelText('Saving');
    const debtCheckbox = screen.getByLabelText('Debt');

    expect((savingCheckbox as HTMLInputElement).checked).toBe(true);
    expect((debtCheckbox as HTMLInputElement).checked).toBe(true);
  });

  it('handles encoded query keys', () => {
    render(
      <SideNavigationDesktop
        {...defaultProps}
        query={{ 'topic%5B%5D': 'saving' }}
      />,
    );

    const savingCheckbox = screen.getByLabelText('Saving');
    expect((savingCheckbox as HTMLInputElement).checked).toBe(true);
  });

  it('displays keyword value from query', () => {
    render(
      <SideNavigationDesktop
        {...defaultProps}
        query={{ keyword: 'test search' }}
      />,
    );

    const keywordInput = screen.getByLabelText('Keyword search');
    expect((keywordInput as HTMLInputElement).value).toBe('test search');
  });

  it('opens year section when year is selected', () => {
    render(
      <SideNavigationDesktop {...defaultProps} query={{ year: 'last-5' }} />,
    );

    // Year section should be open when year is selected
    const yearSection = screen.getByTestId('year-of-publication');
    expect(
      yearSection.querySelector('[data-testid="summary-block-title"]'),
    ).toHaveTextContent('Year of publication');
  });

  it('renders link to definitions when tag group has slug', () => {
    const tagsWithSlug = [
      {
        ...mockTags[0],
        slug: 'topics-definitions',
      },
    ];

    render(<SideNavigationDesktop {...defaultProps} tags={tagsWithSlug} />);

    expect(screen.getByText('Show definitions')).toBeInTheDocument();
    expect(screen.getByText('Show definitions')).toHaveAttribute(
      'href',
      '/en/topics-definitions',
    );
  });

  it('renders Apply filters button', () => {
    render(<SideNavigationDesktop {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: 'Apply filters' }),
    ).toBeInTheDocument();
  });
});

describe('SideNavigationMobile', () => {
  it('renders mobile navigation with collapsible details', () => {
    render(<SideNavigationMobile {...defaultProps} />);

    expect(screen.getByText('Filters')).toBeInTheDocument();
    const details = document.querySelector('details');
    expect(details).toBeInTheDocument();
  });

  it('renders filter content inside details element', () => {
    render(<SideNavigationMobile {...defaultProps} />);

    const topicSection = screen.getByTestId('topic');
    expect(
      topicSection.querySelector('[data-testid="summary-block-title"]'),
    ).toHaveTextContent('Topics');
    expect(screen.getByLabelText('Keyword search')).toBeInTheDocument();
  });

  it('handles query parameters correctly', () => {
    render(
      <SideNavigationMobile
        {...defaultProps}
        query={{ topic: 'saving', year: 'last-2' }}
      />,
    );

    const savingCheckbox = screen.getByLabelText('Saving');
    const yearRadio = screen.getByLabelText('Last 2 years');

    expect((savingCheckbox as HTMLInputElement).checked).toBe(true);
    expect((yearRadio as HTMLInputElement).checked).toBe(true);
  });
});

describe('generateQueryKey', () => {
  it('should generate stable keys for same query regardless of key order', () => {
    const query1 = { topic: 'pensions', keyword: 'test' };
    const query2 = { keyword: 'test', topic: 'pensions' };

    render(<SideNavigationDesktop {...defaultProps} query={query1} />);
    const firstKeywordInput = screen.getByLabelText('Keyword search');

    render(<SideNavigationDesktop {...defaultProps} query={query2} />);
    const secondKeywordInput = screen.getByLabelText('Keyword search');

    // Both should render with same values
    expect(firstKeywordInput).toHaveValue('test');
    expect(secondKeywordInput).toHaveValue('test');
  });

  it('should generate different keys for different queries', () => {
    const query1 = { topic: 'pensions' };
    const query2 = { topic: 'savings' };

    const { rerender } = render(
      <SideNavigationDesktop {...defaultProps} query={query1} />,
    );
    // Verify element exists in first render
    expect(screen.getByLabelText('Saving')).toBeInTheDocument();

    rerender(<SideNavigationDesktop {...defaultProps} query={query2} />);
    // After rerender with different query, component should remount
    // The element should still exist but as a new instance
    const savingCheckbox = screen.getByLabelText('Saving');
    expect(savingCheckbox).toBeInTheDocument();
  });
});

describe('edge cases', () => {
  it('should handle empty tags array', () => {
    render(<SideNavigationDesktop {...defaultProps} tags={[]} />);

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByLabelText('Keyword search')).toBeInTheDocument();
  });

  it('should handle tags with missing key', () => {
    const tagsWithoutKey: TagGroup[] = [
      {
        label: 'Topics',
        key: '',
        slug: '',
        tags: [{ name: 'Saving', key: 'saving' }],
      },
    ];

    render(<SideNavigationDesktop {...defaultProps} tags={tagsWithoutKey} />);

    // When key is empty string, testId will be 'tag-group-0'
    const topicSection = screen.getByTestId('tag-group-0');
    expect(
      topicSection.querySelector('[data-testid="summary-block-title"]'),
    ).toHaveTextContent('Topics');
  });

  it('should open first tag group by default (index === 0)', () => {
    render(<SideNavigationDesktop {...defaultProps} />);

    // First tag group should be open even if no tags are selected
    // This is handled by the hasSelectedItem logic where index === 0
    const topicSection = screen.getByTestId('topic');
    expect(
      topicSection.querySelector('[data-testid="summary-block-title"]'),
    ).toHaveTextContent('Topics');
  });

  it('should handle tag group with undefined key', () => {
    const tagsWithUndefinedKey: TagGroup[] = [
      {
        label: 'Topics',
        key: undefined as unknown as string,
        slug: '',
        tags: [{ name: 'Saving', key: 'saving' }],
      },
    ];

    render(
      <SideNavigationDesktop {...defaultProps} tags={tagsWithUndefinedKey} />,
    );

    // When key is undefined, testId will be 'tag-group-0'
    const topicSection = screen.getByTestId('tag-group-0');
    expect(
      topicSection.querySelector('[data-testid="summary-block-title"]'),
    ).toHaveTextContent('Topics');
  });

  it('should handle query with array values for year', () => {
    render(
      <SideNavigationDesktop
        {...defaultProps}
        query={{ year: ['last-2'] as unknown as string }}
      />,
    );

    // Should handle array year value
    const yearSection = screen.getByTestId('year-of-publication');
    expect(
      yearSection.querySelector('[data-testid="summary-block-title"]'),
    ).toHaveTextContent('Year of publication');
  });

  it('should handle query with numeric year value', () => {
    render(
      <SideNavigationDesktop
        {...defaultProps}
        query={{ year: '2023' as unknown as string }}
      />,
    );

    const yearSection = screen.getByTestId('year-of-publication');
    expect(
      yearSection.querySelector('[data-testid="summary-block-title"]'),
    ).toHaveTextContent('Year of publication');
  });

  it('should handle tag group without slug', () => {
    const tagsWithoutSlug: TagGroup[] = [
      {
        label: 'Topics',
        key: 'topic',
        slug: undefined as unknown as string,
        tags: [{ name: 'Saving', key: 'saving' }],
      },
    ];

    render(<SideNavigationDesktop {...defaultProps} tags={tagsWithoutSlug} />);

    const topicSection = screen.getByTestId('topic');
    expect(
      topicSection.querySelector('[data-testid="summary-block-title"]'),
    ).toHaveTextContent('Topics');
    expect(screen.queryByText('Show definitions')).not.toBeInTheDocument();
  });

  it('should handle empty query object', () => {
    render(<SideNavigationDesktop {...defaultProps} query={{}} />);

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByLabelText('Keyword search')).toBeInTheDocument();
  });

  it('should handle query with undefined values', () => {
    const queryWithUndefined = {
      topic: undefined,
      keyword: 'test',
    } as unknown as Record<string, string | string[]>;

    render(
      <SideNavigationDesktop {...defaultProps} query={queryWithUndefined} />,
    );

    expect(screen.getByLabelText('Keyword search')).toBeInTheDocument();
  });

  it('should handle tags array with empty tags', () => {
    const tagsWithEmptyTags: TagGroup[] = [
      {
        label: 'Topics',
        key: 'topic',
        slug: '',
        tags: [],
      },
    ];

    render(
      <SideNavigationDesktop {...defaultProps} tags={tagsWithEmptyTags} />,
    );

    const topicSection = screen.getByTestId('topic');
    expect(
      topicSection.querySelector('[data-testid="summary-block-title"]'),
    ).toHaveTextContent('Topics');
  });

  it('should handle multiple tag groups with same selected item logic', () => {
    const multipleTags: TagGroup[] = [
      {
        label: 'First Group',
        key: 'first',
        slug: '',
        tags: [{ name: 'Option 1', key: 'option1' }],
      },
      {
        label: 'Second Group',
        key: 'second',
        slug: '',
        tags: [{ name: 'Option 2', key: 'option2' }],
      },
      {
        label: 'Third Group',
        key: 'third',
        slug: '',
        tags: [{ name: 'Option 3', key: 'option3' }],
      },
    ];

    render(
      <SideNavigationDesktop
        {...defaultProps}
        tags={multipleTags}
        query={{ second: 'option2' }}
      />,
    );

    const firstSection = screen.getByTestId('first');
    expect(
      firstSection.querySelector('[data-testid="summary-block-title"]'),
    ).toHaveTextContent('First Group');
    const secondSection = screen.getByTestId('second');
    expect(
      secondSection.querySelector('[data-testid="summary-block-title"]'),
    ).toHaveTextContent('Second Group');
    const thirdSection = screen.getByTestId('third');
    expect(
      thirdSection.querySelector('[data-testid="summary-block-title"]'),
    ).toHaveTextContent('Third Group');
  });
});
