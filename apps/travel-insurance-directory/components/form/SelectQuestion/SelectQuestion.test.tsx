import { useErrorSummary } from 'hooks/useErrorSummary';
import { render, screen } from '@testing-library/react';

import { SelectInput, SelectQuestion } from './SelectQuestion';

jest.mock('hooks/useErrorSummary', () => ({
  useErrorSummary: jest.fn(),
}));

const mockedUseErrorSummary = useErrorSummary as jest.MockedFunction<
  typeof useErrorSummary
>;

describe('SelectQuestion Component', () => {
  const title = 'What is your preferred contact method?';
  const hintText =
    'We will only use this to contact you regarding your account.';
  const mockSelectInput: SelectInput = {
    key: 'test-select-key',
    title: title,
    options: [
      { text: 'Email', value: 'email' },
      { text: 'Phone', value: 'phone' },
    ],
    hintText: hintText,
  };

  beforeEach(() => {
    mockedUseErrorSummary.mockReturnValue({
      fieldErrors: {},
    } as unknown as ReturnType<typeof useErrorSummary>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the select question with title, select input, and hint text', () => {
    render(
      <SelectQuestion selectInput={mockSelectInput} initialValue="email" />,
    );

    const titleElement = screen.getByTestId(`${mockSelectInput.key}-title`);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent(title);

    const selectElement = screen.getByTestId(
      `select-input-${mockSelectInput.key}`,
    );
    expect(selectElement).toBeInTheDocument();

    const hintElement = screen.getByTestId(
      `select-hint-${mockSelectInput.key}`,
    );
    expect(hintElement).toBeInTheDocument();
    expect(hintElement).toHaveTextContent(hintText);
  });

  it('renders correctly when optional props (title and hintText) are omitted', () => {
    const minimalInput: SelectInput = {
      key: 'minimal-select-key',
      options: [{ text: 'Only Option', value: 'only' }],
    };

    render(<SelectQuestion selectInput={minimalInput} initialValue="" />);

    expect(
      screen.queryByTestId(`${minimalInput.key}-title`),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`select-hint-${minimalInput.key}`),
    ).not.toBeInTheDocument();

    expect(
      screen.getByTestId(`select-input-${minimalInput.key}`),
    ).toBeInTheDocument();
  });

  it('handles field validation errors properly', () => {
    mockedUseErrorSummary.mockReturnValue({
      fieldErrors: {
        'test-select-key': 'This field is required',
      },
    } as unknown as ReturnType<typeof useErrorSummary>);

    render(<SelectQuestion selectInput={mockSelectInput} initialValue="" />);

    const selectElement = screen.getByTestId(
      `select-input-${mockSelectInput.key}`,
    );

    expect(selectElement).toBeInTheDocument();
  });
});
