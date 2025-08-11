import { useRouter } from 'next/router';

import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { Guidance } from './Guidance';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockUseTranslation = useTranslation as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

// Mock the `useTranslation` hook
describe('Guidance Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => [
        {
          title: 'mock-title',
          content: 'mock-content',
          items: ['mock-item', 'mock-item'],
          footer: 'mock-footer',
        },
      ],
    });
    mockUseRouter.mockReturnValue({
      asPath: '/en/guidance?aa=mock-flow',
    });
  });

  it('renders component correctly with query string', () => {
    const { container } = render(<Guidance step="mock-step" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders component correctly with no query string', () => {
    mockUseRouter.mockReturnValue({
      asPath: '/en/guidance',
    });
    const { container } = render(<Guidance step="mock-step" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
