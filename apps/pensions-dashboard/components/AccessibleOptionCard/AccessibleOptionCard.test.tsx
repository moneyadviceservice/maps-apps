import { render, screen } from '@testing-library/react';

import { IconType } from '@maps-react/common/components/Icon';

import { AccessibleOptionCard } from './AccessibleOptionCard';

import '@testing-library/jest-dom/extend-expect';

const defaultProps = {
  title: 'Example title',
  toggleLabel: 'Example toggle label',
  icon: IconType.BSL,
  intro: 'Example intro body text for this card.',
  ctaHref: 'example.com/path',
  ctaLabel: 'Example link label',
};

describe('AccessibleOptionCard', () => {
  it('matches snapshot with default props', () => {
    const { container } = render(<AccessibleOptionCard {...defaultProps} />);

    expect(container).toMatchSnapshot();
  });

  it('matches snapshot without optional CTA', () => {
    const { ctaHref, ctaLabel, ...rest } = defaultProps;
    const { container } = render(
      <AccessibleOptionCard {...rest} title="Second example title" />,
    );

    expect(container).toMatchSnapshot();
  });

  it('matches snapshot when CTA is a tel URL (Link without outbound icon)', () => {
    const { container } = render(
      <AccessibleOptionCard
        {...defaultProps}
        title="Alternate example title"
        ctaHref="tel:5551234567"
        ctaLabel="Example phone CTA label"
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders title, toggle label, intro, and outbound CTA link', () => {
    render(<AccessibleOptionCard {...defaultProps} />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Example title' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Example toggle label')).toBeInTheDocument();
    expect(
      screen.getByText(/Example intro body text for this card/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Example link label/ }),
    ).toHaveAttribute('href', 'example.com/path');
    expect(
      screen.getByRole('link', { name: /Example link label/ }),
    ).toHaveAttribute('target', '_blank');
    expect(
      screen.getByRole('link', { name: /Example link label/ }),
    ).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render a CTA when href and label are omitted', () => {
    const { ctaHref, ctaLabel, ...rest } = defaultProps;
    render(<AccessibleOptionCard {...rest} />);

    expect(
      screen.queryByRole('link', { name: /Example link label/i }),
    ).not.toBeInTheDocument();
  });

  it('sets data-testid on the root when testId is provided', () => {
    render(
      <AccessibleOptionCard {...defaultProps} testId="option-card-root" />,
    );

    const root = screen.getByTestId('option-card-root');
    expect(root).toContainElement(
      screen.getByRole('heading', { level: 3, name: 'Example title' }),
    );
  });

  it('does not set data-testid on the root when testId is omitted', () => {
    const { container } = render(<AccessibleOptionCard {...defaultProps} />);

    expect(container.firstElementChild).not.toHaveAttribute('data-testid');
  });
});
