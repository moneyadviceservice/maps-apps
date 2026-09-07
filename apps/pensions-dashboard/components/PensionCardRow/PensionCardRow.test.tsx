import React from 'react';

import { render, screen } from '@testing-library/react';

import { PensionCardRow } from './PensionCardRow';

import '@testing-library/jest-dom/extend-expect';

describe('PensionCardRow component', () => {
  it('renders correctly with term and description', () => {
    render(
      <dl>
        <PensionCardRow
          term="Pension provider:"
          description="Test Provider Name"
          testId="test-item"
        />
      </dl>,
    );

    const term = screen.getByText('Pension provider:');
    const description = screen.getByText('Test Provider Name');
    const descriptionElement = screen.getByTestId('test-item');

    expect(term).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
    expect(term.tagName).toBe('DT');
    expect(description.tagName).toBe('DD');
  });

  it('renders correctly with React node as description', () => {
    render(
      <dl>
        <PensionCardRow
          term="Estimated income:"
          description={
            <>
              <strong className="mr-2 text-[24px]">£500</strong>a month
            </>
          }
          testId="estimated-income"
        />
      </dl>,
    );

    const term = screen.getByText('Estimated income:');
    const amount = screen.getByText('£500');
    const period = screen.getByText('a month');

    expect(term).toBeInTheDocument();
    expect(amount).toBeInTheDocument();
    expect(period).toBeInTheDocument();
  });

  it('renders without testId when not provided', () => {
    const { container } = render(
      <dl>
        <PensionCardRow term="Test term:" description="Test description" />
      </dl>,
    );

    const dd = container.querySelector('dd');
    expect(dd).not.toHaveAttribute('data-testid');
  });

  it('applies correct styling classes', () => {
    const { container } = render(
      <dl>
        <PensionCardRow
          term="Test term:"
          description="Test description"
          testId="test"
        />
      </dl>,
    );

    const dt = container.querySelector('dt');
    const dd = container.querySelector('dd');

    expect(dt).toHaveClass('mb-0', 'font-normal', 'text-gray-650');
    expect(dd).toHaveClass(
      'pb-2',
      'mb-2',
      'break-words',
      'border-b-1',
      'border-slate-400',
    );
  });
});
