import React from 'react';

import { render, screen } from '@testing-library/react';

import { DefinitionItem, DefinitionList } from './DefinitionList';

import '@testing-library/jest-dom/extend-expect';

describe('DefinitionList', () => {
  const mockItems: DefinitionItem[] = [
    { title: 'Term 1', value: 'Description 1', testId: 'item-1' },
    { title: 'Term 2', value: 'Description 2', testId: 'item-2' },
  ];

  it('renders with default testId', () => {
    render(<DefinitionList items={mockItems} />);
    expect(screen.getByTestId('definition-list')).toBeInTheDocument();
  });

  it('renders with custom testId', () => {
    render(<DefinitionList items={mockItems} testId="custom-list" />);
    expect(screen.getByTestId('custom-list')).toBeInTheDocument();
  });

  it('renders dl with custom className', () => {
    render(<DefinitionList items={mockItems} dlClassName="custom-dl-class" />);
    expect(screen.getByTestId('definition-list')).toHaveClass(
      'custom-dl-class',
    );
  });

  it('renders title when provided', () => {
    render(<DefinitionList items={mockItems} title="Test Title" />);
    expect(screen.getByTestId('definition-list-title')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders id and tabIndex on title when titleFocusId is provided', () => {
    render(
      <DefinitionList
        items={mockItems}
        title="Test Title"
        titleFocusId="custom-title-id"
      />,
    );
    const titleElement = screen.getByTestId('definition-list-title');
    expect(titleElement).toHaveAttribute('id', 'custom-title-id');
    expect(titleElement).toHaveAttribute('tabIndex', '-1');
  });

  it('renders subText when provided', () => {
    render(<DefinitionList items={mockItems} subText="Test subtitle" />);
    expect(screen.getByTestId('definition-list-sub-text')).toBeInTheDocument();
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
  });

  it('renders all definition items', () => {
    render(<DefinitionList items={mockItems} />);
    expect(screen.getByTestId('dd-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('dt-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('dt-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('dd-item-2')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<DefinitionList items={mockItems} className="custom-class" />);
    const container = screen.getByTestId('definition-list').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('renders React nodes as title and value', () => {
    const reactItems: DefinitionItem[] = [
      { title: <span>React Title</span>, value: <div>React Value</div> },
    ];
    render(<DefinitionList items={reactItems} />);
    expect(screen.getByText('React Title')).toBeInTheDocument();
    expect(screen.getByText('React Value')).toBeInTheDocument();
  });
});
