import { pensionPotsCopy } from 'data/pensions';
import type { Contribution as ContributionType } from 'types/pensions';
import { fireEvent, render, screen } from '@testing-library/react';

import { Contribution } from './Contribution';

const PERCENTAGE = 'percentage' as const;
const FIXED = 'fixed' as const;
const EMPLOYEE = 'employee' as const;
const EMPLOYER = 'employer' as const;

const RADIO_FIXED_ID = 'radio-fixed';
const AFFIX_PERCENT_ID = 'affix-input-percent';
const AFFIX_MONEY_ID = 'affix-input-money';
const ERRORS_CONTAINER_ID = 'errors-container';
const ERROR_MESSAGE_ID = 'error-message';
const RADIO_ERROR_ID = 'radio-error';
const RADIO_HINT_ID = 'radio-hint';
const ERROR_TEXT = 'Value is required';

interface ErrorsMockProps {
  children: React.ReactNode;
  errors?: string[];
  className?: string;
}

interface DetailsMockProps {
  title: string;
  children: React.ReactNode;
}

interface ParagraphMockProps {
  children: React.ReactNode;
  className?: string;
}

interface AffixInputMockProps {
  id: string;
  name: string;
  label: string;
  value?: string;
  variant?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface QuestionRadioOption {
  text: string;
  value: string;
  children?: React.ReactNode;
}

interface QuestionRadioButtonMockProps {
  children: React.ReactNode;
  hint?: string;
  name: string;
  options: QuestionRadioOption[];
  defaultChecked?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

jest.mock('@maps-react/common/components/Errors', () => ({
  Errors: ({ children, errors, className }: ErrorsMockProps) => (
    <div data-testid={ERRORS_CONTAINER_ID} className={className}>
      {errors?.map((err) => (
        <span key={err} data-testid={ERROR_MESSAGE_ID}>
          {err}
        </span>
      ))}
      {children}
    </div>
  ),
}));

jest.mock('@maps-react/common/components/Details', () => ({
  Details: ({ title, children }: DetailsMockProps) => (
    <details>
      <summary>{title}</summary>
      {children}
    </details>
  ),
}));

jest.mock('@maps-react/common/components/Paragraph', () => ({
  Paragraph: ({ children, className }: ParagraphMockProps) => (
    <p className={className}>{children}</p>
  ),
}));

jest.mock('@maps-react/form/components/AffixInput', () => ({
  AffixInput: ({
    id,
    name,
    label,
    value,
    variant,
    onChange,
  }: AffixInputMockProps) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        data-testid={`affix-input-${variant}`}
      />
    </div>
  ),
}));

jest.mock('@maps-react/form/components/QuestionRadioButton', () => ({
  QuestionRadioButton: ({
    children,
    hint,
    name,
    options,
    defaultChecked,
    onChange,
    error,
  }: QuestionRadioButtonMockProps) => (
    <fieldset>
      <legend>{children}</legend>
      {hint && <p data-testid={RADIO_HINT_ID}>{hint}</p>}
      {error && <span data-testid={RADIO_ERROR_ID}>{error}</span>}
      {options.map((option) => (
        <div key={option.value}>
          <label htmlFor={`${name}-${option.value}`}>{option.text}</label>
          <input
            type="radio"
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            defaultChecked={defaultChecked === option.value}
            onChange={onChange}
            data-testid={`radio-${option.value}`}
          />
          {defaultChecked === option.value && option.children}
        </div>
      ))}
    </fieldset>
  ),
}));

jest.mock('utils/pensionFieldIds', () => ({
  contributionFieldId: (kind: string, field: string, index?: number): string =>
    index !== undefined ? `${kind}-${field}-${index}` : `${kind}-${field}`,
}));

const mockCopy = {
  percentage: 'Percentage',
  fixed: 'Fixed amount',
  percentageInputLabel: 'Percentage input label',
  fixedInputLabel: 'Fixed input label',
  contributionHintLabel: 'Contribution hint label',
  contributionHint: 'Contribution hint text',
} as ReturnType<typeof pensionPotsCopy>;

const createMockContribution = (
  mode: 'percentage' | 'fixed',
  value = '10',
): ContributionType => ({
  mode,
  value,
  frequency: 'month',
});

describe('Contribution Component', () => {
  const kinds: Array<'employee' | 'employer'> = [EMPLOYEE, EMPLOYER];

  describe.each(kinds)('for kind: %s', (kind) => {
    const label = `${kind} Contribution`;

    test.each([[PERCENTAGE], [FIXED]])(
      'renders correctly in %s mode',
      (mode) => {
        const mockContribution = createMockContribution(mode);

        render(
          <Contribution
            kind={kind}
            label={label}
            contribution={mockContribution}
            copy={mockCopy}
            onChange={jest.fn()}
          />,
        );

        expect(screen.getByText(label)).toBeInTheDocument();
        expect(screen.getByText(mockCopy.percentage)).toBeInTheDocument();
        expect(screen.getByText(mockCopy.fixed)).toBeInTheDocument();
        expect(
          screen.getByText(mockCopy.contributionHintLabel),
        ).toBeInTheDocument();
        expect(screen.getByText(mockCopy.contributionHint)).toBeInTheDocument();

        if (mode === PERCENTAGE) {
          expect(screen.getByTestId(AFFIX_PERCENT_ID)).toBeInTheDocument();
          expect(screen.queryByTestId(AFFIX_MONEY_ID)).not.toBeInTheDocument();
          expect(
            screen.getByText(mockCopy.percentageInputLabel),
          ).toBeInTheDocument();
        } else {
          expect(screen.getByTestId(AFFIX_MONEY_ID)).toBeInTheDocument();
          expect(
            screen.queryByTestId(AFFIX_PERCENT_ID),
          ).not.toBeInTheDocument();
          expect(
            screen.getByText(mockCopy.fixedInputLabel),
          ).toBeInTheDocument();
        }
      },
    );

    test('renders hint when hint prop is provided', () => {
      const mockContribution = createMockContribution(PERCENTAGE);
      const hintText = 'Optional hint description';

      render(
        <Contribution
          kind={kind}
          label={label}
          hint={hintText}
          contribution={mockContribution}
          copy={mockCopy}
          onChange={jest.fn()}
        />,
      );

      expect(screen.getByTestId(RADIO_HINT_ID)).toHaveTextContent(hintText);
    });

    test('calls onChange when mode radio changes', () => {
      const mockContribution = createMockContribution(PERCENTAGE);
      const onChangeMock = jest.fn();

      render(
        <Contribution
          kind={kind}
          label={label}
          contribution={mockContribution}
          copy={mockCopy}
          onChange={onChangeMock}
        />,
      );

      fireEvent.click(screen.getByTestId(RADIO_FIXED_ID));

      expect(onChangeMock).toHaveBeenCalledTimes(1);
      expect(onChangeMock).toHaveBeenCalledWith({
        ...mockContribution,
        mode: FIXED,
      });
    });

    test('calls onChange when money input value changes in fixed mode', () => {
      const mockContribution = createMockContribution(FIXED);
      const onChangeMock = jest.fn();

      render(
        <Contribution
          kind={kind}
          label={label}
          contribution={mockContribution}
          copy={mockCopy}
          onChange={onChangeMock}
        />,
      );

      fireEvent.change(screen.getByTestId(AFFIX_MONEY_ID), {
        target: { value: '250' },
      });

      expect(onChangeMock).toHaveBeenCalledTimes(1);
      expect(onChangeMock).toHaveBeenCalledWith({
        ...mockContribution,
        value: '250',
      });
    });

    test('renders error message and passes it to subcomponents when error prop is provided', () => {
      const mockContribution = createMockContribution(PERCENTAGE);

      render(
        <Contribution
          kind={kind}
          label={label}
          contribution={mockContribution}
          error={ERROR_TEXT}
          copy={mockCopy}
          onChange={jest.fn()}
        />,
      );

      expect(screen.getByTestId(ERROR_MESSAGE_ID)).toHaveTextContent(
        ERROR_TEXT,
      );
      expect(screen.getByTestId(RADIO_ERROR_ID)).toHaveTextContent(ERROR_TEXT);
    });

    test('passes potIndex to contributionFieldId when potIndex is provided', () => {
      const mockContribution = createMockContribution(FIXED);
      const potIndex = 1;

      render(
        <Contribution
          kind={kind}
          label={label}
          contribution={mockContribution}
          potIndex={potIndex}
          copy={mockCopy}
          onChange={jest.fn()}
        />,
      );

      const input = screen.getByTestId(AFFIX_MONEY_ID);
      expect(input).toHaveAttribute('id', `${kind}-value-${potIndex}`);

      const radio = screen.getByTestId(RADIO_FIXED_ID);
      expect(radio).toHaveAttribute('name', `${kind}-mode-${potIndex}`);
    });

    test('uses default field ids when potIndex is not provided', () => {
      const mockContribution = createMockContribution(FIXED);

      render(
        <Contribution
          kind={kind}
          label={label}
          contribution={mockContribution}
          copy={mockCopy}
          onChange={jest.fn()}
        />,
      );

      const input = screen.getByTestId(AFFIX_MONEY_ID);
      expect(input).toHaveAttribute('id', `${kind}-value`);

      const radio = screen.getByTestId(RADIO_FIXED_ID);
      expect(radio).toHaveAttribute('name', `${kind}-mode`);
    });

    test('applies custom className to Errors container', () => {
      const mockContribution = createMockContribution(PERCENTAGE);
      const customClassName = 'custom-test-class';

      render(
        <Contribution
          kind={kind}
          label={label}
          contribution={mockContribution}
          copy={mockCopy}
          onChange={jest.fn()}
          className={customClassName}
        />,
      );

      expect(screen.getByTestId(ERRORS_CONTAINER_ID)).toHaveClass(
        customClassName,
      );
    });
  });
});
