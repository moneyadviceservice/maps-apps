import { render, screen } from '@testing-library/react';

import { DateInput } from './DateInput';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: ({ en }: { en: string; cy: string }) => en,
  }),
}));

describe('DateInput Component', () => {
  const renderDateInput = (props = {}) =>
    render(<DateInput showDayField={true} {...props} />);

  describe('Default Rendering', () => {
    it('renders all date fields by default', () => {
      renderDateInput();

      expect(screen.getByLabelText('Day')).toBeInTheDocument();
      expect(screen.getByLabelText('Month')).toBeInTheDocument();
      expect(screen.getByLabelText('Year')).toBeInTheDocument();
    });

    it('hides day field when showDayField is false', () => {
      renderDateInput({ showDayField: false });

      expect(screen.queryByLabelText('Day')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Month')).toBeInTheDocument();
      expect(screen.getByLabelText('Year')).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('applies correct border colors based on field errors', () => {
      renderDateInput({
        fieldErrors: {
          day: true,
          month: true,
          year: true,
        },
        error: 'Error: message goes here',
        errorMessageId: 'date-input-error',
        hintText: 'For example, 27 3 1985',
      });

      const monthInput = screen.getByLabelText('Month');
      expect(monthInput).toHaveClass('border-red-600');
      expect(monthInput).not.toHaveClass('border-gray-400');

      const yearInput = screen.getByLabelText('Year');
      expect(yearInput).toHaveClass('border-red-600');
      expect(yearInput).not.toHaveClass('border-gray-400');
    });

    it('uses default border color when no errors', () => {
      renderDateInput({
        fieldErrors: {
          day: false,
          month: false,
          year: false,
        },
      });

      const monthInput = screen.getByLabelText('Month');
      expect(monthInput).toHaveClass('border-gray-400');

      const yearInput = screen.getByLabelText('Year');
      expect(yearInput).toHaveClass('border-gray-400');
    });
  });

  describe('Default Values', () => {
    it('populates fields with default values', () => {
      renderDateInput({ defaultValues: '15-08-1995' });

      expect(screen.getByLabelText('Day')).toHaveValue('15');
      expect(screen.getByLabelText('Month')).toHaveValue('08');
      expect(screen.getByLabelText('Year')).toHaveValue('1995');
    });

    it('handles empty default values', () => {
      renderDateInput({ defaultValues: '' });

      expect(screen.getByLabelText('Day')).toHaveValue('');
      expect(screen.getByLabelText('Month')).toHaveValue('');
      expect(screen.getByLabelText('Year')).toHaveValue('');
    });
  });

  describe('Hint Text', () => {
    it('displays hint text when provided as string', () => {
      renderDateInput({ hintText: 'Enter your birth date' });

      const hint = screen.getByTestId('date-field-hint');
      expect(hint).toBeInTheDocument();
      expect(hint).toHaveTextContent('Enter your birth date');
    });

    it('does not display hint text when not provided', () => {
      renderDateInput({
        fieldErrors: {
          day: true,
          month: true,
          year: false,
        },
        error: 'Error: message goes here',
        errorMessageId: 'date-input-error',
      });

      expect(screen.queryByTestId('date-field-hint')).not.toBeInTheDocument();
    });

    it('handles empty string hint text', () => {
      renderDateInput({ hintText: '' });

      expect(screen.queryByTestId('date-field-hint')).not.toBeInTheDocument();
    });

    it('renders multi-line string hint text with line breaks', () => {
      renderDateInput({ hintText: 'Line 1\nLine 2\nLine 3' });
      const hint = screen.getByTestId('date-field-hint');
      expect(hint).toBeInTheDocument();
      // Should contain all lines
      expect(hint).toHaveTextContent('Line 1');
      expect(hint).toHaveTextContent('Line 2');
      expect(hint).toHaveTextContent('Line 3');
      // Should have two <br> elements
      expect(hint.querySelectorAll('br')).toHaveLength(2);
    });

    it('renders ReactNode hint text', () => {
      renderDateInput({
        hintText: (
          <span data-testid="custom-hint">
            Custom <b>hint</b> node
          </span>
        ),
      });
      const hint = screen.getByTestId('date-field-hint');
      expect(hint).toBeInTheDocument();
      expect(screen.getByTestId('custom-hint')).toBeInTheDocument();
      expect(hint).toHaveTextContent('Custom hint node');
    });
  });

  describe('Error Wrapper', () => {
    it('applies error wrapper styles when hasErrorWrapper is true', () => {
      const container = renderDateInput({
        fieldErrors: { day: true, month: false, year: false },
        error: 'Error: message goes here',
        hasErrorWrapper: true,
      }).container;

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
