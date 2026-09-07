import { render, screen } from '@testing-library/react';

import { ErrorType } from '@maps-react/form/types';

import { QuestionReferenceDetails } from './QuestionReferenceDetails';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    z: jest.fn((key) => key.en),
  })),
}));

describe('QuestionReferenceDetails Component', () => {
  const mockErrors: ErrorType[] = [
    { question: 'customerReference', message: 'Ref invalid' },
    { question: 'departmentName', message: 'Department name invalid' },
  ];

  const mockCookieData = {
    customerReference: 'random-ref-123',
    departmentName: 'department name',
  };

  it('should render the component with title, labels, and default values', () => {
    render(
      <QuestionReferenceDetails errors={[]} cookieData={mockCookieData} />,
    );

    expect(screen.getByTestId('c-ref-field')).toBeInTheDocument();
    expect(screen.getByTestId('d-name-field')).toBeInTheDocument();

    expect(screen.getByTestId('c-ref-field')).toHaveValue(
      mockCookieData['customerReference'],
    );
    expect(screen.getByTestId('d-name-field')).toHaveValue(
      mockCookieData['departmentName'],
    );
  });

  it('should display error messages when errors are provided', () => {
    render(
      <QuestionReferenceDetails
        errors={mockErrors}
        cookieData={mockCookieData}
      />,
    );

    expect(screen.getByText('Ref invalid')).toBeInTheDocument();
    expect(screen.getByText('Department name invalid')).toBeInTheDocument();
  });

  it('should not display error messages when no errors are provided', () => {
    render(
      <QuestionReferenceDetails errors={[]} cookieData={mockCookieData} />,
    );

    expect(screen.queryByText('Ref invalid')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Department name invalid'),
    ).not.toBeInTheDocument();
  });
});
