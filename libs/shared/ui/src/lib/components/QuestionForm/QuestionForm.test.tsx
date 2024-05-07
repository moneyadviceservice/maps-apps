import React from 'react';
import { render, screen } from '@testing-library/react';
import { QuestionForm } from '.';
import mockData from './QuestionForm.mock.json';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

const mockOptions = {
  formAction: 'api/test',
  query: {
    language: 'en',
  },
};

const mockErrorOptions = {
  formAction: 'api/test',
  query: {
    language: 'en',
    error: 'true',
  },
};

const defaultMock = {
  data: {
    ...mockData,
  },
  ...mockOptions,
};

const mockWithError = {
  data: {
    ...mockData,
  },
  ...mockErrorOptions,
};

const mockWithSaveAndReturn = {
  data: {
    ...mockData,
  },
  ...mockOptions,
  saveReturnLink: true,
};

const mockWithDefinition = {
  data: {
    ...mockData,
    definition: {
      json: [
        {
          nodeType: 'paragraph',
          content: [
            {
              nodeType: 'text',
              value: 'An example definition',
            },
          ],
        },
      ],
    },
  },
  ...mockOptions,
};

describe('QuestionForm component', () => {
  it('renders correctly with default values', () => {
    render(<QuestionForm testId="test-component" {...defaultMock} />);
    const container = screen.getByTestId('test-component');
    expect(container).toMatchSnapshot();
  });

  it('renders with an optional definition', () => {
    render(<QuestionForm testId="test-component" {...mockWithDefinition} />);
    const container = screen.getByTestId('test-component');
    expect(container).toMatchSnapshot();
  });

  it('renders with an optional save and return link', () => {
    render(<QuestionForm testId="test-component" {...mockWithSaveAndReturn} />);
    const container = screen.getByTestId('test-component');
    expect(container).toMatchSnapshot();
  });

  it('renders with an error', () => {
    render(<QuestionForm testId="test-component" {...mockWithError} />);
    const container = screen.getByTestId('test-component');
    expect(container).toMatchSnapshot();
  });
});
