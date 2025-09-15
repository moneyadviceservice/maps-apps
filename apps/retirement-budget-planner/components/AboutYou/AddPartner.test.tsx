import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddPartner } from './AddPartner';
import '@testing-library/jest-dom';
describe('AddPartner', () => {
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
