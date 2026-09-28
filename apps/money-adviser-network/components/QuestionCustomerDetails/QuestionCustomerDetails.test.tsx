import { render, screen } from '@testing-library/react';

import { ErrorType } from '@maps-react/form/types';

import { CookieData, FORM_FIELDS } from '../../data/questions/types';
import { FLOW } from '../../utils/getQuestions';
import { QuestionCustomerDetails } from './QuestionCustomerDetails';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    z: jest.fn((key) => key.en),
  })),
}));

describe('QuestionCustomerDetails Component', () => {
  const mockErrors: ErrorType[] = [
    { question: FORM_FIELDS.firstName, message: 'First name is required' },
    { question: FORM_FIELDS.email, message: 'Email is invalid' },
  ];

  const mockCookieData: CookieData['customerDetails'] = {
    [FORM_FIELDS.firstName]: 'John',
    [FORM_FIELDS.lastName]: 'Doe',
    [FORM_FIELDS.telephone]: '01384239948',
    [FORM_FIELDS.email]: 'john.doe@example.com',
  };

  it('should render the component with title, labels, and default values', () => {
    const { container, getByLabelText } = render(
      <QuestionCustomerDetails
        errors={[]}
        cookieData={mockCookieData}
        variant={FLOW.ONLINE}
      />,
    );

    expect(getByLabelText("Customer's first name")).toBeInTheDocument();
    expect(getByLabelText("Customer's last name")).toBeInTheDocument();
    expect(getByLabelText("Customer's email address")).toBeInTheDocument();

    expect(getByLabelText("Customer's first name")).toHaveValue('John');
    expect(getByLabelText("Customer's last name")).toHaveValue('Doe');
    expect(getByLabelText("Customer's email address")).toHaveValue(
      'john.doe@example.com',
    );

    expect(container).toMatchSnapshot();
  });

  it('should display error messages when errors are provided', () => {
    const { container, getByText } = render(
      <QuestionCustomerDetails
        errors={mockErrors}
        cookieData={mockCookieData}
        variant={FLOW.ONLINE}
      />,
    );

    expect(getByText('First name is required')).toBeInTheDocument();
    expect(getByText('Email is invalid')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('should not display error messages when no errors are provided', () => {
    const { container, queryByText } = render(
      <QuestionCustomerDetails
        errors={[]}
        cookieData={mockCookieData}
        variant={FLOW.ONLINE}
      />,
    );

    expect(queryByText('First name is required')).not.toBeInTheDocument();
    expect(queryByText('Email is invalid')).not.toBeInTheDocument();
  });
});
