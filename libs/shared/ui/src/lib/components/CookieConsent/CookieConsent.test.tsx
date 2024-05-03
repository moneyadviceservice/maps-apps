import React from 'react';
import { render } from '@testing-library/react';
import { CookieConsent } from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

window.gtag = jest.fn();
window.CookieControl = {
  load: jest.fn(),
  open: jest.fn(),
};

describe('ToolPageLayout', () => {
  it('renders correctly', () => {
    const { container } = render(<CookieConsent isOpen={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });
});
