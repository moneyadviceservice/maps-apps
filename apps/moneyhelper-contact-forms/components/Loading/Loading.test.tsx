import { render } from '@testing-library/react';

import { Loading } from './Loading';

// Mock the `useTranslation` hook
describe('Loading Component', () => {
  it('renders component correctly', () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
