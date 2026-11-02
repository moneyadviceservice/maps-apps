import { InputErrorTypes } from 'types/register';
import { generateSummaryErrors } from 'utils/helper/register/generateSummaryErrors/generateSummaryErrors';
import { act, render, screen } from '@testing-library/react';

import { ErrorContext, ErrorSummaryProvider } from './ErrorSummaryProvider';

jest.mock('utils/helper/register/generateSummaryErrors/generateSummaryErrors');

jest.mock('@maps-react/form/components/ErrorSummary', () => ({
  ErrorSummary: ({ title }: { title: string }) => (
    <div data-testid="error-summary">{title}</div>
  ),
}));

describe('ErrorSummaryProvider', () => {
  const mockGenerateSummaryErrors = generateSummaryErrors as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide initial context values', () => {
    render(
      <ErrorSummaryProvider>
        {(context) => {
          expect(context.fieldErrors).toBeNull();
          expect(context.errorSummarySection).toBeNull();

          expect(typeof context.setFormSummaryErrors).toBe('function');
          expect(typeof context.setSubmittedEmail).toBe('function');

          return null;
        }}
      </ErrorSummaryProvider>,
    );
  });

  it('should generate errors when initialErrors provided', () => {
    const mockErrors = {
      mail: ['required'],
    };

    mockGenerateSummaryErrors.mockReturnValue(mockErrors);

    const initialErrors = { mail: { error: 'required' as InputErrorTypes } };

    render(
      <ErrorSummaryProvider initialErrors={initialErrors}>
        {() => {
          expect(mockGenerateSummaryErrors).toHaveBeenCalled();

          return null;
        }}
      </ErrorSummaryProvider>,
    );
  });

  it('should render ErrorSummary when errors exist', () => {
    mockGenerateSummaryErrors.mockReturnValue({
      mail: ['required'],
    });

    const initialErrors = { mail: { error: 'required' as InputErrorTypes } };

    render(
      <ErrorSummaryProvider initialErrors={initialErrors}>
        {({ errorSummarySection }) => <div>{errorSummarySection}</div>}
      </ErrorSummaryProvider>,
    );

    expect(screen.getByTestId('error-summary')).toBeInTheDocument();

    expect(screen.getByText('There is a problem')).toBeInTheDocument();
  });

  it('should update when setFormSummaryErrors called', () => {
    mockGenerateSummaryErrors.mockReturnValue({
      mail: ['Required'],
    });

    let contextRef:
      | (typeof ErrorContext extends React.Context<infer T> ? T : never)
      | undefined;

    render(
      <ErrorSummaryProvider>
        {(context) => {
          contextRef = context;
          return null;
        }}
      </ErrorSummaryProvider>,
    );

    act(() => {
      if (contextRef) {
        contextRef.setFormSummaryErrors({
          mail: { error: 'required' as InputErrorTypes },
        });
      }
    });

    expect(mockGenerateSummaryErrors).toHaveBeenCalled();
  });

  it('should update when setSubmittedEmail called', () => {
    mockGenerateSummaryErrors.mockReturnValue({
      mail: ['Required'],
    });

    let contextRef: typeof ErrorContext extends React.Context<infer T>
      ? T
      : undefined;

    const initialErrors = { mail: { error: 'required' as InputErrorTypes } };

    render(
      <ErrorSummaryProvider initialErrors={initialErrors}>
        {(context) => {
          contextRef = context;
          return null;
        }}
      </ErrorSummaryProvider>,
    );

    act(() => {
      if (contextRef) {
        contextRef.setSubmittedEmail('test@email.com');
      }
    });

    expect(mockGenerateSummaryErrors).toHaveBeenCalled();
  });
});
