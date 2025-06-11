import { render, screen } from '@testing-library/react';
import { WhatToDo } from './WhatToDo';
import '@testing-library/jest-dom';
import { whatToDo } from '../../../data/form-content/text/results';

jest.mock('../../../data/form-content/text/results', () => ({
  whatToDo: jest.fn(),
}));

jest.mock('@maps-react/hooks/useTranslation', () => {
  return jest.fn(() => ({
    z: jest.fn((t: { en: string; cy: string }) => t.en),
  }));
});

describe('WhatToDo Component', () => {
  const mockHeading = 'What to do';
  const mockItems = [
    { heading: 'Item 1', content: 'Content for item 1' },
    { heading: 'Item 2', content: 'Content for item 2' },
  ];

  beforeEach(() => {
    (whatToDo as jest.Mock).mockReturnValue({
      heading: mockHeading,
      items: mockItems,
    });
  });

  it('renders the heading correctly', () => {
    render(<WhatToDo showAdditionalItem={false} />);
    expect(screen.getByText(mockHeading)).toBeInTheDocument();
  });

  it('renders the first item when showAdditionalItem is false', () => {
    render(<WhatToDo showAdditionalItem={false} />);
    expect(screen.getByText('1. Item 2')).toBeInTheDocument();
    expect(screen.queryByText('1. Item 1')).not.toBeInTheDocument();
  });

  it('renders all items when showAdditionalItem is true', () => {
    render(<WhatToDo showAdditionalItem={true} />);
    expect(screen.getByText('1. Item 1')).toBeInTheDocument();
    expect(screen.getByText('2. Item 2')).toBeInTheDocument();
  });

  it('renders the content of each item correctly', () => {
    render(<WhatToDo showAdditionalItem={true} />);
    expect(screen.getByText('Content for item 1')).toBeInTheDocument();
    expect(screen.getByText('Content for item 2')).toBeInTheDocument();
  });

  it('applies the correct class for the first item', () => {
    render(<WhatToDo showAdditionalItem={true} />);
    const firstItem = screen.getByText('1. Item 1').closest('div');
    expect(firstItem).not.toHaveClass('mt-8');
  });

  it('applies the correct class for subsequent items', () => {
    render(<WhatToDo showAdditionalItem={true} />);
    const secondItem = screen.getByText('2. Item 2').closest('div');
    expect(secondItem).toHaveClass('mt-8');
  });
});
