import { render } from '@testing-library/react';

import { mockSteps } from '@maps-react/mhf/mocks';

import { ContactFormsLayout } from './';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
    };
  },
}));

describe('ContactFormsLayout', () => {
  it('renders correctly', () => {
    const { container } = render(
      <ContactFormsLayout step={mockSteps[0]}>test content</ContactFormsLayout>,
    );
    expect(container).toMatchSnapshot();
  });
});
