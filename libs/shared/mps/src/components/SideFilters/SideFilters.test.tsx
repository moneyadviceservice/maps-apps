import { cleanup, render, screen } from '@testing-library/react';

import { SideFiltersType } from '.';
import { SideFilterMock } from './mocks';
import { SideFiltersDesktop } from './SideFiltersDesktop';
import { SideFiltersMobile } from './SideFiltersMobile';

import '@testing-library/jest-dom';

const props = {
  tags: SideFilterMock,
  query: {},
  title: 'Filters',
  clearAllTitle: 'Clear all',
  searchTitle: 'Search by...',
  applyFiltersLabel: 'Apply filter',
  clearAllLink: '/en/test-page',
  lang: 'en',
} as SideFiltersType;

describe('SideFiltersDesktop component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders component correctly', () => {
    const { container } = render(<SideFiltersDesktop {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('renders desktop filter header, controls and tag groups', () => {
    render(<SideFiltersDesktop {...props} />);

    expect(
      screen.getByRole('heading', {
        name: 'Filters',
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText('Search by...')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Apply filter',
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId('summary-block-title')).toHaveLength(2);
  });

  it('merges incoming className with component classes', () => {
    const { container } = render(
      <SideFiltersDesktop {...props} className="custom-wrapper" />,
    );

    expect(container.firstChild).toHaveClass('custom-wrapper');
  });
});

describe('SideFiltersMobile component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders component correctly', () => {
    const { container } = render(<SideFiltersMobile {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('renders mobile filter header, controls and tag groups', () => {
    render(<SideFiltersMobile {...props} />);

    expect(
      screen.getByRole('heading', {
        name: 'Filters',
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Search by...')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Apply filter',
      }),
    ).toBeInTheDocument();

    expect(screen.getAllByTestId('summary-block-title')).toHaveLength(2);
  });

  it('merges incoming className with mobile wrapper classes', () => {
    const { container } = render(
      <SideFiltersMobile {...props} className="custom-mobile-wrapper" />,
    );

    expect(container.firstChild).toHaveClass('custom-mobile-wrapper');
  });
});
