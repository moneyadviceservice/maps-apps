import { ReactNode } from 'react';

import { render, screen } from '@testing-library/react';

import { ListElement } from '.';

import '@testing-library/jest-dom';

const descriptionHelper = (color: string, variant: string) =>
  `renders the ${variant} ${color} list correctly`;

const listUnorderedBase = {
  color: 'magenta',
  variant: 'unordered',
  description: descriptionHelper('magenta', 'unordered'),
} as const;

const listOrderedBase = {
  ...listUnorderedBase,
  variant: 'ordered',
  description: descriptionHelper('magenta', 'ordered'),
} as const;

const listNoColorBase = {
  color: 'none',
  variant: 'none',
  description: descriptionHelper('none', 'none'),
} as const;

describe('List component', () => {
  const Content: ReactNode[] = [];
  beforeAll(() => {
    Content.push(<p>First line</p>);
    Content.push(<p>Second Line</p>);
    Content.push(<p>Third Line</p>);
  });

  const testCases = [
    {
      ...listUnorderedBase,
    },
    {
      ...listUnorderedBase,
      color: 'dark',
      description: descriptionHelper('dark', 'unordered'),
    },
    {
      ...listUnorderedBase,
      color: 'blue',
      description: descriptionHelper('blue', 'unordered'),
    },
    {
      ...listOrderedBase,
    },
    {
      ...listOrderedBase,
      color: 'dark',
      description: descriptionHelper('dark', 'ordered'),
    },
    {
      ...listOrderedBase,
      color: 'blue',
      description: descriptionHelper('blue', 'ordered'),
    },
    {
      ...listNoColorBase,
    },
    {
      ...listNoColorBase,
      variant: 'pros',
      description: descriptionHelper('none', 'pros'),
    },
    {
      ...listNoColorBase,
      variant: 'cons',
      description: descriptionHelper('none', 'cons'),
    },
    {
      color: 'red',
      variant: 'error',
      description: descriptionHelper('red', 'error'),
    },
  ] as const;

  it.each(testCases)('$description', ({ color, variant }) => {
    render(<ListElement items={Content} color={color} variant={variant} />);
    const list = screen.getByTestId('list-element');
    expect(list).toMatchSnapshot();
  });

  it('renders nested list items as a sublist', () => {
    render(
      <ListElement
        items={[
          'Parent item one',
          {
            content: 'Nested list item',
            sublist: {
              variant: 'unordered',
              items: ['Child item one', 'Child item two'],
            },
          },
        ]}
        color="magenta"
        variant="unordered"
      />,
    );

    const sublist = screen.getByTestId('nested-list');

    expect(sublist).toBeInTheDocument();
    expect(sublist).toHaveTextContent('Child item one');
    expect(sublist).toHaveTextContent('Child item two');
  });

  it('renders dataTestId in parent and sublist', () => {
    render(
      <ListElement
        dataTestId="parent"
        color="red"
        variant="unordered"
        items={[
          'Parent',
          {
            sublist: {
              items: ['One'],
              variant: 'unordered',
            },
            content: 'Nested',
          },
        ]}
      />,
    );

    const parent = screen.getByTestId('parent');
    expect(parent).toBeInTheDocument();

    const parentSublist = screen.getByTestId('parent-nested-list');
    expect(parentSublist).toBeInTheDocument();
  });
});
