import React from 'react';

import { render, screen } from '@testing-library/react';

import { LanguageSwitcher } from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('LanguageSwitcher component', () => {
  it('renders correctly', () => {
    render(<LanguageSwitcher testId="test-component" />);
    const container = screen.getByTestId('test-component');
    expect(container).toMatchSnapshot();
  });
});
