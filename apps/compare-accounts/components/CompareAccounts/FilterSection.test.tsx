import { fireEvent, render, screen } from '@testing-library/react';

import FilterSection from './FilterSection';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { language: 'en' },
  }),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn().mockReturnValue({
    z: jest.fn((key: { cy: string }) => key.cy),
  }),
}));

const items = [
  {
    title: 'Basic Account',
    value: 'basic',
    details: 'A simple account with basic features.',
  },
  {
    title: 'Premium Account',
    value: 'premium',
    details: 'A premium account with advanced features.',
  },
];

describe('FilterSection', () => {
  it('renders the title correctly', () => {
    render(<FilterSection title="Test Title" items={[]} />);

    expect(screen.getByRole('heading', { level: 5 })).toHaveTextContent(
      'Test Title',
    );
  });

  it('renders checkboxes for each item', () => {
    render(<FilterSection title="Test Title" items={items} />);

    expect(screen.getByLabelText('Basic Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Premium Account')).toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <FilterSection title="Test Title" items={[]} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should toggle checkbox selection correctly', () => {
    render(<FilterSection title="Test Title" items={items} />);

    const checkbox = screen.getByLabelText('Basic Account');

    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  describe('FilterSection', () => {
    it('renders correct translations for the button', () => {
      render(<FilterSection title="Test Title" items={[]} />);

      // Check if the Welsh translations appear for the buttons
      expect(screen.getByText('Dangos diffiniadau')).toBeInTheDocument();
      expect(screen.getByText('Cuddio diffiniadau')).toBeInTheDocument();
    });
  });
});
