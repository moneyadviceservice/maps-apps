import { useRouter } from 'next/router';

import { render, screen } from '@testing-library/react';

import { QuickLinks } from './QuickLinks';

import '@testing-library/jest-dom/extend-expect';

const linkText = ['text1', 'text2', 'text3'];

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('QuickLinks', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: {},
    });
  });

  it('renders the correct number of items', () => {
    render(<QuickLinks linkText={linkText} />);

    const guide = screen.getByTestId('quick-links');
    expect(guide).toBeInTheDocument();

    const links = screen.getAllByTestId(/section-\d+-link/);
    expect(links).toHaveLength(3);
  });

  it('generates correct href and testid for each link', () => {
    render(<QuickLinks linkText={linkText} />);

    const link1 = screen.getByTestId('section-1-link');
    const link2 = screen.getByTestId('section-2-link');

    expect(link1).toHaveAttribute('href', '#section1');
    expect(link2).toHaveAttribute('href', '#section2');
  });

  it('displays translated text for each section', () => {
    render(<QuickLinks linkText={linkText} />);

    expect(screen.getByText('text1')).toBeInTheDocument();
    expect(screen.getByText('text2')).toBeInTheDocument();
  });

  it('handles zero items', () => {
    render(<QuickLinks linkText={[]} />);

    const guide = screen.queryByTestId('quick-links');
    expect(guide).not.toBeInTheDocument();
  });

  it('sets tabindex and focuses element when URL hash matches existing element', () => {
    const mockElement = {
      setAttribute: jest.fn(),
      focus: jest.fn(),
    };

    // Mock window.location.hash
    delete (window as any).location;
    (window as any).location = { hash: '#section1' };

    // Mock document.getElementById
    const getElementByIdSpy = jest
      .spyOn(document, 'getElementById')
      .mockReturnValue(mockElement as any);

    render(<QuickLinks linkText={linkText} />);

    expect(getElementByIdSpy).toHaveBeenCalledWith('section1');
    expect(mockElement.setAttribute).toHaveBeenCalledWith('tabindex', '-1');
    expect(mockElement.focus).toHaveBeenCalled();

    getElementByIdSpy.mockRestore();
  });
});
