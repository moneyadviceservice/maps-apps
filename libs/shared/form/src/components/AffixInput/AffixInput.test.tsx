import { fireEvent, render, screen } from '@testing-library/react';

import { AffixInput } from './AffixInput';

describe('AffixInput', () => {
  describe('money variant', () => {
    it('renders the pound prefix', () => {
      render(<AffixInput variant="money" id="amount" />);

      expect(screen.getByText('£')).toBeInTheDocument();
    });

    it('uses the money defaults', () => {
      render(<AffixInput variant="money" id="amount" />);

      const input = screen.getByRole('textbox');

      expect(input).toHaveAttribute('inputmode', 'numeric');
    });

    it('renders an addon', () => {
      render(<AffixInput variant="money" id="amount" addon="per month" />);

      expect(screen.getByText('per month')).toBeInTheDocument();
      expect(screen.getByText('per month')).toHaveClass(
        'border-l',
        'border-l-gray-400',
      );
    });
  });

  describe('percent variant', () => {
    it('renders the percent suffix', () => {
      render(<AffixInput variant="percent" id="percentage" />);

      expect(screen.getByText('%')).toBeInTheDocument();
    });

    it('uses decimal input mode', () => {
      render(<AffixInput variant="percent" id="percentage" />);

      expect(screen.getByRole('textbox')).toHaveAttribute(
        'inputmode',
        'decimal',
      );
    });

    it('limits the value to between 0 and 100', () => {
      render(<AffixInput variant="percent" id="percentage" />);

      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '100' } });
      expect(input).toHaveValue('100');

      fireEvent.change(input, { target: { value: '101' } });
      expect(input).toHaveValue('100');
    });
  });

  describe('errors', () => {
    it('renders a label and hint and associates them with the input', () => {
      render(
        <AffixInput
          variant="money"
          id="amount"
          label="Amount"
          labelClassName="mb-1"
          hint="Enter an amount"
          hintClassName="text-lg mb-2 break-normal"
          error="Amount is required"
          aria-describedby="amount-description"
        />,
      );

      expect(screen.getByLabelText('Amount')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toHaveClass('mb-1');
      expect(screen.getByTestId('amount-hint')).toHaveTextContent(
        'Enter an amount',
      );
      expect(screen.getByTestId('amount-hint')).toHaveClass(
        'text-lg',
        'mb-2',
        'break-normal',
      );
      expect(screen.getByTestId('amount-error')).toHaveTextContent(
        'Amount is required',
      );
      expect(screen.getByLabelText('Amount')).toHaveAttribute(
        'aria-describedby',
        'amount-hint amount-error amount-description',
      );
    });

    it('renders the error message', () => {
      render(
        <AffixInput variant="money" id="amount" error="Enter an amount" />,
      );

      expect(screen.getByText('Enter an amount')).toBeInTheDocument();
    });

    it('uses the input id to generate the error id', () => {
      render(
        <AffixInput variant="money" id="amount" error="Enter an amount" />,
      );

      expect(screen.getByTestId('amount-error')).toHaveTextContent(
        'Enter an amount',
      );
    });

    it('sets aria-invalid when there is an error', () => {
      render(
        <AffixInput
          variant="money"
          id="amount"
          error="Enter an amount"
          addon="per month"
        />,
      );

      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-invalid',
        'true',
      );
      expect(screen.getByRole('textbox')).toHaveClass(
        'border-red-700',
        'border-2',
      );
      expect(screen.getByText('£')).toHaveClass('border-red-700', 'border-2');
      expect(screen.getByText('£')).toHaveClass(
        'border-r',
        'border-r-gray-400',
      );
      expect(screen.getByText('per month')).toHaveClass(
        'border-red-700',
        'border-2',
      );
      expect(screen.getByText('per month')).toHaveClass(
        'border-l',
        'border-l-gray-400',
      );
    });

    it('styles an invalid field from hasError without rendering an error message', () => {
      render(<AffixInput variant="money" id="amount" hasError />);

      expect(screen.getByRole('textbox')).toHaveClass(
        'border-red-700',
        'border-2',
      );
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-invalid',
        'true',
      );
      expect(screen.queryByTestId('amount-error')).not.toBeInTheDocument();
    });

    it('adds the error id to aria-describedby', () => {
      render(
        <AffixInput variant="money" id="amount" error="Enter an amount" />,
      );

      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-describedby',
        'amount-error',
      );
    });

    it('merges the error id with an existing aria-describedby', () => {
      render(
        <AffixInput
          variant="money"
          id="amount"
          error="Enter an amount"
          aria-describedby="amount-description"
        />,
      );

      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-describedby',
        'amount-error amount-description',
      );
    });

    it('does not set aria-invalid when there is no error', () => {
      render(<AffixInput variant="money" id="amount" />);

      expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
    });

    it('wraps the input in Errors when hasErrorWrapper is true', () => {
      render(
        <AffixInput
          variant="money"
          id="amount"
          error="Enter an amount"
          hasErrorWrapper
        />,
      );

      expect(screen.getByText('Enter an amount')).toBeInTheDocument();
    });
  });

  describe('overrides', () => {
    it('uses a row wrapper so the input container can shrink to its content', () => {
      render(<AffixInput variant="money" id="amount" />);

      expect(
        screen.getByRole('textbox').parentElement?.parentElement,
      ).toHaveClass('flex');
    });

    it('applies inputClassName to the input container', () => {
      render(
        <AffixInput
          variant="money"
          id="amount"
          inputClassName="custom-input-container"
        />,
      );

      expect(screen.getByRole('textbox').parentElement).toHaveClass(
        'custom-input-container',
      );
    });

    it('applies containerClassName', () => {
      render(
        <AffixInput
          variant="money"
          id="amount"
          containerClassName="custom-container"
        />,
      );

      expect(
        screen.getByRole('textbox').parentElement?.parentElement?.parentElement,
      ).toHaveClass('custom-container');
    });

    it('applies inputBackground', () => {
      render(
        <AffixInput
          variant="money"
          id="amount"
          inputBackground="bg-gray-100"
        />,
      );

      expect(screen.getByRole('textbox')).toHaveClass('bg-gray-100');
    });
  });
});
