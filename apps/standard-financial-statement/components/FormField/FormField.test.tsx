import React from 'react';

import { QuestionOrg } from 'data/form-data/org_signup';
import { fireEvent, render } from '@testing-library/react';

import { FormField } from './FormField';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('FormField', () => {
  const baseInput: QuestionOrg = {
    name: 'testField',
    title: 'Test Field',
    type: 'text',
    definition: '',
    errors: {},
    questionNbr: 1,
    group: '',
    answers: [],
  };
  const testId = 'test-id';

  it('renders a text input with label', () => {
    const { getByLabelText } = render(
      <FormField input={baseInput} hasError={false} id={testId} />,
    );
    expect(getByLabelText('Test Field')).toBeInTheDocument();
  });

  it('renders a number input', () => {
    const numberInput = {
      ...baseInput,
      type: 'number',
      name: 'age',
      title: 'Age',
    };
    const { getByLabelText } = render(
      <FormField input={numberInput} hasError={false} id={testId} />,
    );
    expect(getByLabelText('Age')).toBeInTheDocument();
  });

  it('renders a password input with show/hide toggle', () => {
    const passwordInput = {
      ...baseInput,
      type: 'password',
      name: 'password',
      title: 'Password',
    };
    const { getByLabelText, getByRole } = render(
      <FormField
        input={passwordInput}
        hasError={false}
        id={testId}
        isPassword
      />,
    );
    const input = getByLabelText('Password');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
    const toggleBtn = getByRole('button');
    expect(toggleBtn).toBeInTheDocument();
    fireEvent.click(toggleBtn);
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders error message and ARIA attributes', () => {
    const errorInput = {
      ...baseInput,
      name: 'email',
      title: 'Email',
      type: 'text',
    };
    const { getByText, getByLabelText } = render(
      <FormField
        input={errorInput}
        hasError={true}
        errorId="email-error"
        errorMsg="This field is required"
        id={testId}
      />,
    );
    const errorMsg = getByText('This field is required');
    expect(errorMsg).toBeInTheDocument();
    expect(errorMsg).toHaveAttribute('id', 'email-error');
    expect(errorMsg).toHaveAttribute('role', 'alert');
    expect(getByLabelText('Email')).toHaveAttribute(
      'aria-describedby',
      'email-error',
    );
    expect(getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });
});
