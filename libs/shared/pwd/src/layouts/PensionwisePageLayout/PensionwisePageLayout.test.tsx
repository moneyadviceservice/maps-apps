import React from 'react';
import { render } from '@testing-library/react';
import { PensionwisePageLayout } from '.';
import mockSharedContent from './PensionwisePageLayout.mock.json';

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

const routeMock = {
  query: {
    test: 'something',
  },
  app: 'some-app',
};

const routeMockWithError = {
  query: {
    test: 'something',
    error: 'true',
  },
  app: 'some-app',
};

describe('PensionwisePageLayout', () => {
  it('renders correctly', () => {
    const { container } = render(
      <PensionwisePageLayout
        route={routeMock}
        sharedContent={mockSharedContent}
      >
        test content
      </PensionwisePageLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('has default back button', () => {
    const { container } = render(
      <PensionwisePageLayout
        route={{ ...routeMock, back: '/' }}
        sharedContent={mockSharedContent}
      >
        test content
      </PensionwisePageLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('has back button with external url', () => {
    const { container } = render(
      <PensionwisePageLayout
        route={{ ...routeMock, back: 'https://external-site.com' }}
        sharedContent={mockSharedContent}
      >
        test content
      </PensionwisePageLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('has default next button', () => {
    const { container } = render(
      <PensionwisePageLayout
        route={{ ...routeMock, next: '/' }}
        sharedContent={mockSharedContent}
      >
        test content
      </PensionwisePageLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('has back button with custom text', () => {
    const { container } = render(
      <PensionwisePageLayout
        route={{ ...routeMock, back: '/', backText: 'test back' }}
        sharedContent={mockSharedContent}
      >
        test content
      </PensionwisePageLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('has next button with custom text', () => {
    const { container } = render(
      <PensionwisePageLayout
        route={{ ...routeMock, next: '/', nextText: 'test next' }}
        sharedContent={mockSharedContent}
      >
        test content
      </PensionwisePageLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('has save and return link if added', () => {
    const { container } = render(
      <PensionwisePageLayout
        route={{ ...routeMock, next: '/', saveReturnLink: true }}
        sharedContent={mockSharedContent}
      >
        test content
      </PensionwisePageLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('has error message', () => {
    const { container } = render(
      <PensionwisePageLayout
        route={routeMockWithError}
        sharedContent={mockSharedContent}
      >
        test content
      </PensionwisePageLayout>,
    );
    expect(container).toMatchSnapshot();
  });
});
