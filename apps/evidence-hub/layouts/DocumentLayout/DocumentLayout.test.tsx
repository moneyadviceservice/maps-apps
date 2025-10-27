import { render } from '@testing-library/react';

import { DocumentLayout } from './DocumentLayout';
import { mock } from './mock';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/',
  }),
}));

describe('DocumentLayout', () => {
  it('renders correctly', () => {
    const { container } = render(<DocumentLayout page={mock}></DocumentLayout>);
    expect(container).toMatchSnapshot();
  });
});
