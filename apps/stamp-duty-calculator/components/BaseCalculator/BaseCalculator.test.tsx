import { AnalyticsData } from '@maps-react/hooks/useAnalytics';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BaseCalculator } from './BaseCalculator';
import { CalculatorConfig } from './types';

// Mock the dependencies
jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    z: (obj: { en: string; cy: string }) => obj.en,
  }),
}));

const mockAddEvent = jest.fn();
jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    addEvent: mockAddEvent,
  }),
}));

// Mock the components
jest.mock('@maps-react/common/components/Button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock('@maps-react/common/components/Errors', () => ({
  Errors: ({ children, errors }: any) => (
    <div data-testid="errors-wrapper" data-errors={errors?.length ?? 0}>
      {children}
    </div>
  ),
}));

jest.mock('@maps-react/common/components/ExpandableSection', () => ({
  ExpandableSection: ({ title, children }: any) => (
    <div data-testid="expandable-section">
      <h3>{title}</h3>
      {children}
    </div>
  ),
}));

jest.mock('@maps-react/common/components/Heading', () => ({
  H3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
}));

jest.mock('@maps-react/common/components/InformationCallout', () => ({
  InformationCallout: ({ children }: any) => (
    <div data-testid="information-callout">{children}</div>
  ),
}));

jest.mock('@maps-react/common/components/ToolFeedback', () => ({
  ToolFeedback: () => <div data-testid="tool-feedback">Tool Feedback</div>,
}));

jest.mock('@maps-react/core/components/Container', () => ({
  Container: ({ children, className }: any) => (
    <div data-testid="container" className={className}>
      {children}
    </div>
  ),
}));

jest.mock('@maps-react/form/components/ErrorSummary', () => {
  const React = require('react');
  const { forwardRef, useImperativeHandle } = React;
  return {
    ErrorSummary: forwardRef(({ title, errors }: any, ref: any) => {
      useImperativeHandle(ref, () => ({
        focus: jest.fn(),
        scrollIntoView: jest.fn(),
      }));
      return (
        <div data-testid="error-summary" tabIndex={-1}>
          <h2>{title}</h2>
          {Object.entries(errors).map(([field, fieldErrors]: any) =>
            fieldErrors.map((error: string) => (
              <div key={`${field}-${error}`}>
                {field}: {error}
              </div>
            )),
          )}
        </div>
      );
    }),
  };
});

jest.mock('@maps-react/form/components/MoneyInput', () => ({
  MoneyInput: ({ onChange, onKeyDown, ...props }: any) => (
    <input
      {...props}
      type="text"
      data-testid={`money-input-${props.name}`}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  ),
}));

jest.mock('@maps-react/form/components/Select', () => ({
  Select: ({ onChange, options, ...props }: any) => (
    <select {...props} data-testid={`select-${props.name}`} onChange={onChange}>
      {options?.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.text}
        </option>
      ))}
    </select>
  ),
}));

// Mock DOM methods that are not available in jsdom
if (!global.HTMLElement.prototype.scrollIntoView) {
  global.HTMLElement.prototype.scrollIntoView = jest.fn();
}
if (!global.HTMLElement.prototype.focus) {
  global.HTMLElement.prototype.focus = jest.fn();
}

// Test data
const mockConfig: CalculatorConfig = {
  name: 'Test Calculator',
  title: 'Test Calculator Title',
  introduction: 'This is a test calculator',
  fields: [
    {
      name: 'buyerType',
      label: 'Buyer Type',
      type: 'select',
      options: [
        { value: 'first', text: 'First Time Buyer' },
        { value: 'next', text: 'Next Home' },
      ],
      defaultValue: 'first',
    },
    {
      name: 'price',
      label: 'Property Price',
      type: 'money',
      defaultValue: '',
    },
  ],
  calculate: (input: any) => {
    if (!input.price || parseFloat(input.price) === 0) return null;
    return {
      tax: parseFloat(input.price) * 0.1,
      buyerType: input.buyerType,
    };
  },
  formatResult: (result: any) => (
    <div data-testid="result">Tax: £{result.tax}</div>
  ),
  validateForm: (input: any) => {
    const errors: Record<string, string[]> = {};
    if (!input.buyerType) {
      errors.buyerType = ['Please select a buyer type'];
    }
    if (!input.price || parseFloat(input.price) <= 0) {
      errors.price = ['Please enter a valid price'];
    }
    return errors;
  },
  analyticsToolName: 'Test Calculator',
  analyticsSteps: {
    calculate: 'Calculate Step',
    results: 'Results Step',
  },

  resultTitle: (input: any, _z: any) => `Result for ${input.buyerType}`,
  howIsItCalculated: (_input: any, _isEmbedded: boolean, _z: any) => (
    <div>This is how it's calculated</div>
  ),
  didYouKnow: (_isEmbedded: boolean, _z: any) => (
    <div>Did you know section</div>
  ),
  findOutMore: (_input: any, _isEmbedded: boolean, _z: any) => (
    <div>Find out more section</div>
  ),
  relatedLinks: (_isEmbedded: boolean, _z: any) => (
    <div>Related links section</div>
  ),
  haveYouTried: (_isEmbedded: boolean, _z: any) => (
    <div>Have you tried section</div>
  ),
};

// Alternative config for testing edge cases
const minimalConfig: CalculatorConfig = {
  name: 'Minimal Calculator',
  title: 'Minimal Calculator Title',
  introduction: (isEmbedded, _z) => (
    <div>{isEmbedded ? 'Embedded intro' : 'Standard intro'}</div>
  ),
  fields: [
    {
      name: 'amount',
      label: 'Amount',
      type: 'money',
    },
  ],
  calculate: (input: any) => ({ result: input.amount }),
  formatResult: (result: any, _input: any, _z: any) => (
    <div>Result: {result.result}</div>
  ),
  analyticsToolName: 'Minimal Calculator',
};

describe('BaseCalculator', () => {
  const defaultProps = {
    config: mockConfig,
    initialValues: {},
    calculated: false,
    analyticsData: { event: 'toolStart' } as AnalyticsData,
    isEmbedded: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the basic structure', () => {
      render(<BaseCalculator {...defaultProps} />);

      expect(screen.getByText('This is a test calculator')).toBeInTheDocument();
      expect(screen.getByLabelText('Buyer Type')).toBeInTheDocument();
      expect(screen.getByLabelText('Property Price')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Calculate' }),
      ).toBeInTheDocument();
    });

    it('should render with initial values', () => {
      render(
        <BaseCalculator
          {...defaultProps}
          initialValues={{ buyerType: 'next', price: '250000' }}
        />,
      );

      const select = screen.getByTestId('select-buyerType');
      const input = screen.getByTestId('money-input-price');

      expect(select).toHaveValue('next');
      expect(input).toHaveValue('250000');
    });

    it('should render result when calculated', () => {
      render(
        <BaseCalculator
          {...defaultProps}
          calculated={true}
          initialValues={{ buyerType: 'first', price: '300000' }}
        />,
      );

      expect(screen.getByTestId('result')).toHaveTextContent('Tax: £30000');
    });

    it('should render error summary when there are validation errors', () => {
      render(
        <BaseCalculator
          {...defaultProps}
          calculated={true}
          initialValues={{ buyerType: '', price: '0' }}
        />,
      );

      expect(screen.getByTestId('error-summary')).toBeInTheDocument();
      expect(screen.getAllByText(/Please select a buyer type/)).toHaveLength(2); // In error summary and field error
      expect(screen.getAllByText(/Please enter a valid price/)).toHaveLength(2); // In error summary and field error
    });

    it('should render expandable sections when calculated with result', () => {
      render(
        <BaseCalculator
          {...defaultProps}
          calculated={true}
          initialValues={{ buyerType: 'first', price: '300000' }}
        />,
      );

      expect(screen.getAllByTestId('expandable-section')).toHaveLength(2); // Mobile and desktop
      expect(screen.getByText('Did you know section')).toBeInTheDocument();
      expect(screen.getByText('Find out more section')).toBeInTheDocument();
      expect(screen.getByText('Have you tried section')).toBeInTheDocument();
    });

    it('should render related links when not calculated', () => {
      render(<BaseCalculator {...defaultProps} />);

      expect(screen.getByText('Related links section')).toBeInTheDocument();
    });

    it('should render tool feedback when calculated with result', () => {
      render(
        <BaseCalculator
          {...defaultProps}
          calculated={true}
          initialValues={{ buyerType: 'first', price: '300000' }}
        />,
      );

      expect(screen.getByTestId('tool-feedback')).toBeInTheDocument();
    });

    it('should handle function-based content', () => {
      render(
        <BaseCalculator
          {...defaultProps}
          config={minimalConfig}
          isEmbedded={true}
        />,
      );

      expect(screen.getByText('Embedded intro')).toBeInTheDocument();
    });

    it('should handle fields as a function', () => {
      const dynamicLabel = (_z: any) =>
        _z({ en: 'Dynamic Field', cy: 'Dynamic Field' });

      const configWithFieldsFunction = {
        ...mockConfig,
        fields: (_z: any) => [
          {
            name: 'dynamicField',
            label: dynamicLabel,
            type: 'money' as const,
            defaultValue: '100',
          },
          {
            name: 'staticField',
            label: 'Static Field',
            type: 'select' as const,
            options: [
              { value: 'opt1', text: 'Option 1' },
              { value: 'opt2', text: 'Option 2' },
            ],
          },
        ],
      };

      render(
        <BaseCalculator {...defaultProps} config={configWithFieldsFunction} />,
      );

      expect(screen.getByLabelText('Dynamic Field')).toBeInTheDocument();
      expect(screen.getByLabelText('Static Field')).toBeInTheDocument();
      expect(screen.getByTestId('money-input-dynamicField')).toHaveValue('100');
    });

    it('should render field options from fieldOptions function', () => {
      const configWithFieldOptions = {
        ...mockConfig,
        fieldOptions: {
          buyerType: (_z: any) => [
            { value: 'custom1', text: 'Custom Option 1' },
            { value: 'custom2', text: 'Custom Option 2' },
          ],
        },
      };

      render(
        <BaseCalculator {...defaultProps} config={configWithFieldOptions} />,
      );

      expect(screen.getByText('Custom Option 1')).toBeInTheDocument();
      expect(screen.getByText('Custom Option 2')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should fire analytics events on field interaction', async () => {
      const user = userEvent.setup();
      render(<BaseCalculator {...defaultProps} />);

      const select = screen.getByTestId('select-buyerType');
      await user.selectOptions(select, 'next');

      expect(mockAddEvent).toHaveBeenCalledWith({
        event: 'toolStart',
      });
      expect(mockAddEvent).toHaveBeenCalledWith({
        event: 'toolInteraction',
        eventInfo: {
          toolName: 'Test Calculator',
          toolStep: 1,
          stepName: 'Calculate Step',
          reactCompType: 'Select',
          reactCompName: 'buyerType',
        },
      });
    });

    it('should fire analytics events on money input change', async () => {
      const user = userEvent.setup();
      render(<BaseCalculator {...defaultProps} />);

      const input = screen.getByTestId('money-input-price');

      // Clear any previous calls
      mockAddEvent.mockClear();

      // Type to trigger change event
      await user.type(input, '2');

      // Should have toolStart and toolInteraction events
      expect(mockAddEvent).toHaveBeenCalledTimes(2);
      expect(mockAddEvent).toHaveBeenCalledWith({
        event: 'toolStart',
      });
      expect(mockAddEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'toolInteraction',
          eventInfo: expect.objectContaining({
            reactCompType: 'MoneyInput',
            reactCompName: 'price',
          }),
        }),
      );
    });

    it('should track field interactions only once per field', async () => {
      const user = userEvent.setup();
      render(<BaseCalculator {...defaultProps} />);

      const input = screen.getByTestId('money-input-price');

      mockAddEvent.mockClear();

      // Type multiple characters
      await user.type(input, '123');

      // Count toolInteraction events for price field
      const interactionEvents = mockAddEvent.mock.calls.filter(
        (call) =>
          call[0].event === 'toolInteraction' &&
          call[0].eventInfo?.reactCompName === 'price',
      );

      // Should only track once despite multiple keystrokes
      expect(interactionEvents).toHaveLength(1);
    });

    it('should handle keydown events on money input', () => {
      render(<BaseCalculator {...defaultProps} />);

      const input = screen.getByTestId('money-input-price');
      fireEvent.keyDown(input, { key: '5' });

      expect(mockAddEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'toolInteraction',
        }),
      );
    });

    it('should not track non-digit keydown events', () => {
      render(<BaseCalculator {...defaultProps} />);

      const input = screen.getByTestId('money-input-price');
      mockAddEvent.mockClear();

      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockAddEvent).not.toHaveBeenCalled();
    });

    it('should handle form submission with onCalculate callback', () => {
      const onCalculate = jest.fn();
      render(
        <BaseCalculator
          {...defaultProps}
          onCalculate={onCalculate}
          initialValues={{ buyerType: 'first', price: '300000' }}
        />,
      );

      const form = screen
        .getByRole('button', { name: 'Calculate' })
        .closest('form')!;
      fireEvent.submit(form);

      expect(onCalculate).toHaveBeenCalledWith({
        buyerType: 'first',
        price: '300000',
      });
    });

    it('should set recalculated value when already calculated', () => {
      const { container } = render(
        <BaseCalculator
          {...defaultProps}
          calculated={true}
          initialValues={{ buyerType: 'first', price: '300000' }}
        />,
      );

      // Get the recalculated input that's already in the form
      const recalculatedInput = container.querySelector(
        '#recalculated',
      ) as HTMLInputElement;

      const form = screen
        .getByRole('button', { name: 'Recalculate' })
        .closest('form')!;
      fireEvent.submit(form);

      expect(recalculatedInput.value).toBe('true');
    });

    it('should allow natural form submission without onCalculate', () => {
      const { container } = render(<BaseCalculator {...defaultProps} />);

      const form = container.querySelector('form')!;
      const preventDefaultSpy = jest.spyOn(Event.prototype, 'preventDefault');

      fireEvent.submit(form);

      expect(preventDefaultSpy).not.toHaveBeenCalled();

      preventDefaultSpy.mockRestore();
    });
  });

  describe('Analytics', () => {
    it('should fire toolStart event on first interaction', async () => {
      const user = userEvent.setup();
      render(<BaseCalculator {...defaultProps} />);

      mockAddEvent.mockClear();

      const select = screen.getByTestId('select-buyerType');
      await user.selectOptions(select, 'next');

      expect(mockAddEvent).toHaveBeenCalledWith({
        event: 'toolStart',
      });
    });

    it('should fire toolRestart event when calculated', async () => {
      const user = userEvent.setup();
      render(
        <BaseCalculator
          {...defaultProps}
          calculated={true}
          initialValues={{ buyerType: 'first', price: '300000' }}
        />,
      );

      mockAddEvent.mockClear();

      const select = screen.getByTestId('select-buyerType');
      await user.selectOptions(select, 'next');

      expect(mockAddEvent).toHaveBeenCalledWith({
        event: 'toolRestart',
      });
    });

    it('should fire toolCompletion event when calculated successfully', () => {
      render(
        <BaseCalculator
          {...defaultProps}
          calculated={true}
          initialValues={{ buyerType: 'first', price: '300000' }}
        />,
      );

      expect(mockAddEvent).toHaveBeenCalledWith({
        event: 'toolCompletion',
      });
    });

    it('should fire errorMessage event when there are validation errors', () => {
      render(
        <BaseCalculator
          {...defaultProps}
          calculated={true}
          initialValues={{ buyerType: '', price: '0' }}
        />,
      );

      expect(mockAddEvent).toHaveBeenCalledWith({
        event: 'errorMessage',
        eventInfo: {
          toolName: 'Test Calculator',
          toolStep: 1,
          stepName: 'Calculate Step',
          errorDetails: [
            {
              reactCompType: 'Select',
              reactCompName: 'buyerType',
              errorMessage: 'Please select a buyer type',
            },
            {
              reactCompType: 'MoneyInput',
              reactCompName: 'price',
              errorMessage: 'Please enter a valid price',
            },
          ],
        },
      });
    });

    it('should use correct step names based on calculated state', async () => {
      const user = userEvent.setup();
      render(
        <BaseCalculator
          {...defaultProps}
          calculated={true}
          initialValues={{ buyerType: 'first', price: '300000' }}
        />,
      );

      mockAddEvent.mockClear();

      const select = screen.getByTestId('select-buyerType');
      await user.selectOptions(select, 'next');

      expect(mockAddEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'toolInteraction',
          eventInfo: expect.objectContaining({
            toolStep: 2,
            stepName: 'Results Step',
          }),
        }),
      );
    });
  });

  describe('Focus Management', () => {
    it('should focus on info element when calculated successfully', async () => {
      const { container } = render(
        <BaseCalculator
          {...defaultProps}
          calculated={true}
          initialValues={{ buyerType: 'first', price: '300000' }}
        />,
      );

      await waitFor(() => {
        const infoElement = container.querySelector('#info-element');
        expect(infoElement).toBeInTheDocument();
      });
    });

    it('should focus on error summary when there are errors', async () => {
      // The ErrorSummary component already has mocked focus/scrollIntoView
      render(
        <BaseCalculator
          {...defaultProps}
          calculated={true}
          initialValues={{ buyerType: '', price: '0' }}
        />,
      );

      await waitFor(() => {
        expect(screen.getByTestId('error-summary')).toBeInTheDocument();
      });
    });
  });

  describe('Hidden Inputs', () => {
    it('should render hidden inputs with correct values', () => {
      const { container } = render(
        <BaseCalculator {...defaultProps} isEmbedded={true} />,
      );

      const isEmbeddedInput = container.querySelector(
        'input[name="isEmbedded"]',
      ) as HTMLInputElement;
      const calculatedInput = container.querySelector(
        'input[name="calculated"]',
      ) as HTMLInputElement;
      const recalculatedInput = container.querySelector(
        'input[name="recalculated"]',
      ) as HTMLInputElement;

      expect(isEmbeddedInput.value).toBe('true');
      expect(calculatedInput.value).toBe('true');
      expect(recalculatedInput.value).toBe('false');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null result from calculate function', () => {
      const configWithNullResult = {
        ...mockConfig,
        calculate: () => null,
      };

      render(
        <BaseCalculator
          {...defaultProps}
          config={configWithNullResult}
          calculated={true}
          initialValues={{ buyerType: 'first', price: '0' }}
        />,
      );

      expect(screen.queryByTestId('result')).not.toBeInTheDocument();
    });

    it('should handle fields without default values', () => {
      const configWithoutDefaults = {
        ...minimalConfig,
        fields: [
          {
            name: 'testField',
            label: 'Test Field',
            type: 'money' as const,
          },
        ],
      };

      render(
        <BaseCalculator {...defaultProps} config={configWithoutDefaults} />,
      );

      const input = screen.getByTestId('money-input-testField');
      expect(input).toHaveValue('');
    });

    it('should handle embedded class variations', () => {
      const { container, rerender } = render(
        <BaseCalculator
          {...defaultProps}
          calculated={true}
          initialValues={{ buyerType: 'first', price: '300000' }}
          isEmbedded={false}
        />,
      );

      const lastContainer = Array.from(
        container.querySelectorAll('[data-testid="container"]'),
      ).pop() as HTMLElement;

      expect(lastContainer.className).not.toContain('pb-5');

      rerender(
        <BaseCalculator
          {...defaultProps}
          calculated={true}
          initialValues={{ buyerType: 'first', price: '300000' }}
          isEmbedded={true}
        />,
      );

      expect(lastContainer.className).toContain('pb-5');
    });

    it('should not show related links when calculated with result', () => {
      render(
        <BaseCalculator
          {...defaultProps}
          calculated={true}
          initialValues={{ buyerType: 'first', price: '300000' }}
        />,
      );

      expect(
        screen.queryByText('Related links section'),
      ).not.toBeInTheDocument();
    });

    it('should show related links when calculated without result', () => {
      render(
        <BaseCalculator
          {...defaultProps}
          calculated={true}
          initialValues={{ buyerType: 'first', price: '0' }}
        />,
      );

      expect(screen.getByText('Related links section')).toBeInTheDocument();
    });

    it('should handle responsive visibility for expandable sections', () => {
      render(
        <BaseCalculator
          {...defaultProps}
          calculated={true}
          initialValues={{ buyerType: 'first', price: '300000' }}
        />,
      );

      const expandableSections = screen.getAllByTestId('expandable-section');
      const mobileSection = expandableSections[0].closest('.lg\\:hidden');
      const desktopSection = expandableSections[1].closest('.lg\\:block');

      expect(mobileSection).toBeInTheDocument();
      expect(desktopSection).toBeInTheDocument();
    });
  });

  describe('Form Attributes', () => {
    it('should set correct form attributes', () => {
      const { container } = render(<BaseCalculator {...defaultProps} />);

      const form = container.querySelector('form')!;
      expect(form.id).toBe('calculator');
      expect(form.method).toBe('get');
      expect(form.action).toContain('#calculator');
    });
  });

  describe('Button States', () => {
    it('should show Calculate button when not calculated', () => {
      render(<BaseCalculator {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Calculate');
      expect(button.className).toBe(
        'w-full lg:w-auto test calculator-calculate',
      );
    });

    it('should show Recalculate button when calculated', () => {
      render(
        <BaseCalculator
          {...defaultProps}
          calculated={true}
          initialValues={{ buyerType: 'first', price: '300000' }}
        />,
      );

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Recalculate');
      expect(button.className).toBe(
        'w-full lg:w-auto test calculator-recalculate',
      );
    });
  });

  describe('Conditional Rendering', () => {
    it('should conditionally render sections based on config', () => {
      const minimalConfigNoSections = {
        ...minimalConfig,
        howIsItCalculated: undefined,
        didYouKnow: undefined,
        findOutMore: undefined,
        relatedLinks: undefined,
        haveYouTried: undefined,
      };

      render(
        <BaseCalculator
          {...defaultProps}
          config={minimalConfigNoSections}
          calculated={true}
          initialValues={{ amount: '1000' }}
        />,
      );

      expect(
        screen.queryByTestId('expandable-section'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Did you know section'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Find out more section'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Related links section'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Have you tried section'),
      ).not.toBeInTheDocument();
    });
  });
});
