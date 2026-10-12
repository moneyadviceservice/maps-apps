import type { usePensionsForm } from 'hooks/usePensionsForm';
import { fireEvent, render, screen } from '@testing-library/react';

import { PotDetails } from './PotDetails';

jest.mock('hooks/usePensionsForm', () => ({
  PENSIONS_API: '/api/pensions',
}));

jest.mock('utils/pensionFieldIds', () => ({
  ADD_PENSION_ID: 'add-pension-button',
  potNameId: (i: number) => `pot-name-${i}`,
  potCurrentValueId: (i: number) => `pot-current-value-${i}`,
  potTaxFreeCashId: (i: number) => `pot-tax-free-cash-${i}`,
  potRemoveId: (i: number) => `pot-remove-${i}`,
}));

jest.mock('@maps-react/common/components/Button', () => ({
  Button: ({
    id,
    children,
    onClick,
  }: {
    id: string;
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }) => (
    <button id={id} data-testid={id} onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('@maps-react/common/components/Details', () => ({
  Details: ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div>
      <h3>{title}</h3>
      {children}
    </div>
  ),
}));

jest.mock('@maps-react/form/components/TextInput', () => ({
  TextInput: ({
    id,
    value,
    onChange,
  }: {
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => <input id={id} data-testid={id} value={value} onChange={onChange} />,
}));

jest.mock('../MoneyField', () => ({
  MoneyField: ({
    id,
    label,
    value,
    error,
    onChange,
  }: {
    id: string;
    label: string;
    value: string;
    error?: string;
    onChange: (v: string) => void;
  }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        data-testid={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <span data-testid={`${id}-error`}>{error}</span>}
    </div>
  ),
}));

type PensionsFormProps = ReturnType<typeof usePensionsForm>;

const createMockProps = (
  overrides?: Partial<PensionsFormProps>,
): PensionsFormProps =>
  ({
    copy: {
      pension: 'Pension',
      pensionName: 'Pension Name',
      pensionNamePlaceholder: 'e.g. Workplace Pension',
      currentValue: 'Current Value',
      findValue: 'Find value guidance',
      findValueGuidance: 'How to find your value',
      taxFreeCash: 'Tax Free Cash',
      removePension: 'Remove pension',
      taxFreeCashCallout: 'Tax Free Cash Note',
      taxFreeCashGuidance: 'Guidance text',
      addPension: 'Add another pension',
    },
    data: {
      pots: [
        { name: 'Pot 1', currentValue: '1000', taxFreeCash: '250' },
        { name: 'Pot 2', currentValue: '2000', taxFreeCash: '500' },
      ],
    },
    errors: {},
    handleAdd: jest.fn(),
    handleRemove: jest.fn(),
    updatePot: jest.fn(),
    ...overrides,
  } as unknown as PensionsFormProps);

describe('PotDetails Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders all pension pots, callout, and add pension button', () => {
    const props = createMockProps();
    render(<PotDetails {...props} />);

    expect(screen.getByText('Pension 1')).toBeInTheDocument();
    expect(screen.getByText('Pension 2')).toBeInTheDocument();
    expect(screen.getByText(props.copy.taxFreeCashCallout)).toBeInTheDocument();
    expect(screen.getByTestId('add-pension-button')).toBeInTheDocument();
  });

  test.each([
    ['name', 'pot-name-0', 'My New Pension Name', 'name'],
    ['currentValue', 'pot-current-value-0', '5000', 'currentValue'],
    ['taxFreeCash', 'pot-tax-free-cash-0', '1250', 'taxFreeCash'],
  ])(
    'calls updatePot when %s input changes',
    (_, testId, newValue, fieldName) => {
      const updatePotMock = jest.fn();
      const props = createMockProps({ updatePot: updatePotMock });

      render(<PotDetails {...props} />);

      const input = screen.getByTestId(testId);
      fireEvent.change(input, { target: { value: newValue } });

      expect(updatePotMock).toHaveBeenCalledTimes(1);
      expect(updatePotMock).toHaveBeenCalledWith(0, fieldName, newValue);
    },
  );

  test('passes error messages to corresponding MoneyFields when errors exist', () => {
    const props = createMockProps({
      errors: {
        'pot-current-value-0': ['Invalid current value'],
        'pot-tax-free-cash-0': ['Invalid tax free cash'],
      },
    });

    render(<PotDetails {...props} />);

    expect(screen.getByTestId('pot-current-value-0-error')).toHaveTextContent(
      'Invalid current value',
    );
    expect(screen.getByTestId('pot-tax-free-cash-0-error')).toHaveTextContent(
      'Invalid tax free cash',
    );
  });

  test('renders remove button only for pots after the first pot and triggers handleRemove', () => {
    const handleRemoveMock = jest.fn();
    const props = createMockProps({ handleRemove: handleRemoveMock });

    render(<PotDetails {...props} />);

    expect(screen.queryByTestId('pot-remove-0')).not.toBeInTheDocument();

    const removeBtnIndex1 = screen.getByTestId('pot-remove-1');
    expect(removeBtnIndex1).toBeInTheDocument();

    fireEvent.click(removeBtnIndex1);

    expect(handleRemoveMock).toHaveBeenCalledTimes(1);
    expect(handleRemoveMock).toHaveBeenCalledWith(expect.anything(), 1);
  });

  test('calls handleAdd when add pension button is clicked', () => {
    const handleAddMock = jest.fn();
    const props = createMockProps({ handleAdd: handleAddMock });

    render(<PotDetails {...props} />);

    const addButton = screen.getByTestId('add-pension-button');
    fireEvent.click(addButton);

    expect(handleAddMock).toHaveBeenCalledTimes(1);
  });
});
