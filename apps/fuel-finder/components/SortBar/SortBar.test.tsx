import { render } from '@testing-library/react';

import {
  mockedUseRouter,
  setupUseRouter,
} from '../../utils/FuelFinder/testHelpers';
import SortBar from './SortBar';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

describe('SortBar', () => {
  setupUseRouter();

  it('renders with default query (distance sort, perPage 3)', () => {
    const { container } = render(<SortBar />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with sort=price selected in the router query', () => {
    mockedUseRouter.mockReturnValueOnce({
      push: jest.fn(),
      query: { language: 'en', sort: 'price' },
      asPath: '/en/fuel-finder?sort=price',
    });
    const { container } = render(<SortBar />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with perPage=20 selected in the router query', () => {
    mockedUseRouter.mockReturnValueOnce({
      push: jest.fn(),
      query: { language: 'en', perPage: '20' },
      asPath: '/en/fuel-finder?perPage=20',
    });
    const { container } = render(<SortBar />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
