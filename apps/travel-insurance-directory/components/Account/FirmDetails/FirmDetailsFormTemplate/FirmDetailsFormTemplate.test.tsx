import { createSubmitHandler } from 'utils/helper/form/createSubmitHandler';
import { fireEvent, render, screen } from '@testing-library/react';

import { FirmDetailsFormTemplate } from './FirmDetailsFormTemplate';

const mockPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockSetFormSummaryErrors = jest.fn();
jest.mock('hooks/useErrorSummary', () => ({
  useErrorSummary: () => ({
    setFormSummaryErrors: mockSetFormSummaryErrors,
  }),
}));

jest.mock('utils/helper/form/createSubmitHandler', () => ({
  createSubmitHandler: jest.fn(),
}));

jest.mock('components/Account/FirmDetails/DefaultHiddenFields', () => ({
  DefaultHiddenFields: ({
    firmId,
    isChangeAnswer,
  }: {
    firmId: string;
    isChangeAnswer?: string;
  }) => (
    <div
      data-testid="mock-hidden-fields"
      data-firm-id={firmId}
      data-change-answer={isChangeAnswer ?? ''}
    />
  ),
}));

jest.mock('components/form/FormPage', () => ({
  FormPage: ({
    children,
    submitAction,
    formName,
    hiddenFields,
  }: {
    children: React.ReactNode;
    submitAction: (e: React.FormEvent<HTMLFormElement>) => void;
    formName: string;
    hiddenFields?: React.ReactNode;
  }) => (
    <form data-testid="mock-form-page" name={formName} onSubmit={submitAction}>
      {hiddenFields}
      {children}
    </form>
  ),
}));

jest.mock('@maps-react/common/components/Paragraph', () => ({
  Paragraph: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}));

describe('FirmDetailsFormTemplate', () => {
  const mockPageConfig = {
    description: 'Test Description text content',
    submitApi: '/api/test-endpoint',
    nextStep: '/account/next-page',
    formKey: 'test-form-key',
  };

  const defaultProps = {
    firmId: 'firm-123',
    isChangeAnswer: 'true',
    pageConfig: mockPageConfig,
  };

  const mockSubmitInnerFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (createSubmitHandler as jest.Mock).mockReturnValue(mockSubmitInnerFunction);
  });

  it('renders the layout components, description text, and child fields correctly', () => {
    render(
      <FirmDetailsFormTemplate {...defaultProps}>
        <input data-testid="child-input" type="text" />
      </FirmDetailsFormTemplate>,
    );

    expect(
      screen.getByText('Test Description text content'),
    ).toBeInTheDocument();

    const formElement = screen.getByTestId('mock-form-page');
    expect(formElement).toBeInTheDocument();
    expect(formElement).toHaveAttribute('name', 'test-form-key');

    expect(screen.getByTestId('child-input')).toBeInTheDocument();

    const hiddenFieldsMock = screen.getByTestId('mock-hidden-fields');
    expect(hiddenFieldsMock).toBeInTheDocument();
    expect(hiddenFieldsMock).toHaveAttribute('data-firm-id', 'firm-123');
    expect(hiddenFieldsMock).toHaveAttribute('data-change-answer', 'true');
  });

  it('instantiates createSubmitHandler with configurations and triggers it on submit', () => {
    render(
      <FirmDetailsFormTemplate {...defaultProps}>
        <button type="submit">Submit</button>
      </FirmDetailsFormTemplate>,
    );

    expect(createSubmitHandler).toHaveBeenCalledWith({
      apiUrl: '/api/test-endpoint',
      nextStep: '/account/next-page',
      setIsPending: expect.any(Function),
      setFormSummaryErrors: mockSetFormSummaryErrors,
      router: expect.objectContaining({ push: mockPush }),
    });

    const formElement = screen.getByTestId('mock-form-page');
    fireEvent.submit(formElement);

    expect(mockSubmitInnerFunction).toHaveBeenCalledTimes(1);
  });
});
