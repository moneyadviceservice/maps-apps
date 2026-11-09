import { render, screen } from '@testing-library/react';

import { ActivitySetList } from './ActivitySetList';

import '@testing-library/jest-dom';

const makeDescription = (value: string) => ({
  json: [
    {
      nodeType: 'paragraph',
      content: [{ nodeType: 'text', value, marks: [] }],
    },
  ],
});

const items = [
  {
    title: 'Initial contact',
    description: makeDescription('First point of contact'),
  },
  {
    title: 'Support work',
    description: makeDescription('Provide information'),
  },
];

describe('ActivitySetList', () => {
  it('renders a row with term and definition for each item', () => {
    render(
      <ActivitySetList
        items={items}
        keyHeading="Activity set"
        valueHeading="Definition"
      />,
    );

    expect(screen.getAllByTestId('activity-set-list-row')).toHaveLength(2);

    expect(screen.getByText('Initial contact')).toBeInTheDocument();
    expect(screen.getByText('First point of contact')).toBeInTheDocument();
    expect(screen.getByText('Support work')).toBeInTheDocument();
    expect(screen.getByText('Provide information')).toBeInTheDocument();
  });

  it('renders the column headings', () => {
    render(
      <ActivitySetList
        items={items}
        keyHeading="Activity set"
        valueHeading="Definition"
      />,
    );

    expect(screen.getByText('Activity set')).toBeInTheDocument();
    expect(screen.getByText('Definition')).toBeInTheDocument();
  });

  it('supports a custom testId', () => {
    render(
      <ActivitySetList
        items={items}
        keyHeading="Activity set"
        valueHeading="Definition"
        testId="activity-sets"
      />,
    );

    expect(screen.getByTestId('activity-sets')).toBeInTheDocument();
    expect(screen.getAllByTestId('activity-sets-row')).toHaveLength(2);
  });

  it('renders no rows when the list is empty', () => {
    render(
      <ActivitySetList
        items={[]}
        keyHeading="Activity set"
        valueHeading="Definition"
      />,
    );

    expect(
      screen.queryByTestId('activity-set-list-row'),
    ).not.toBeInTheDocument();
  });
});
