import React from 'react';
import { render, screen } from '@testing-library/react';
import { SaveReturnLink } from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('Save and return component', () => {
  it('renders correctly', () => {
    render(
      <SaveReturnLink
        href={{
          pathname: '/path-to-save-page',
          query: 'language=en',
        }}
        testId="save-return-test"
      />,
    );
    const saveAndReturn = screen.getByTestId('save-return-test');
    expect(saveAndReturn).toMatchSnapshot();
  });
});
