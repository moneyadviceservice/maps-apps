import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import useTranslation from '@maps-react/hooks/useTranslation';
jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

import { AddPartner } from './AddPartner';

describe('AddPartner', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => {
        const translations: { [key: string]: string } = {
          'aboutYou.addPartner.title': 'Would you like to add someone else?',
          'aboutYou.addPartner.buttonLabel': 'Add another person',
        };
        return translations[key] || key;
      },
    });
  });
  it('renders heading and button, and triggers onAdd when clicked', () => {
    const mockOnAdd = jest.fn();

    render(<AddPartner onAdd={mockOnAdd} />);
    expect(screen.getByRole('heading', { level: 5 })).toHaveTextContent(
      'Would you like to add someone else?',
    );
    const button = screen.getByRole('button', { name: /add another person/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(mockOnAdd).toHaveBeenCalledTimes(1);
  });
});
