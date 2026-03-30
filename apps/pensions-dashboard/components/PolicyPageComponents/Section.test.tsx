import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { Section } from './Section';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');
describe('Section', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    id: '1',
    title: 'Test Section',
    children: <div>Test content</div>,
  };

  it('renders section with correct id and data-testid', () => {
    render(<Section {...defaultProps} />);
    const section = screen.getByTestId('section1');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('id', 'section1');
  });

  it('renders heading with section number and title', () => {
    render(<Section {...defaultProps} />);
    expect(screen.getByTestId('section-heading1')).toHaveTextContent(
      '1. Test Section',
    );
  });

  it('renders children content', () => {
    render(<Section {...defaultProps} />);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders back to top link with correct href', () => {
    render(<Section {...defaultProps} />);
    const backToTopLink = screen.getByTestId('section-back-to-top1');
    expect(backToTopLink).toHaveAttribute('href', '#quick-links');
    expect(backToTopLink).toHaveTextContent('site.back-to-top');
  });
});
