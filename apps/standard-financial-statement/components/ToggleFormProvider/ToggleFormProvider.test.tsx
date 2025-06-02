import { FormType } from 'data/form-data/org_signup';
import { PageTemplate } from 'types/@adobe/page';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { ToggleFormProvider } from './ToggleFormProvider';

import '@testing-library/jest-dom';

const scrollIntoViewMock = jest.fn();

Object.defineProperty(window.Element.prototype, 'scrollIntoView', {
  writable: true,
  value: scrollIntoViewMock,
});

jest.mock('@maps-react/hooks/useTranslation', () => () => ({
  z: ({ en }: { en: string; cy: string }) => en,
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        entry: {
          data: {},
          errors: [],
        },
      }),
    ok: true,
    status: 200,
  }),
) as jest.Mock;

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: {},
    replace: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}));

describe('ToggleFormProvider', () => {
  it('renders correctly as new org', () => {
    const { container } = render(
      <ToggleFormProvider
        entry={{
          data: {
            flow: FormType.NEW_ORG,
          },
          errors: [],
        }}
        assetPath=""
        page={{
          pageTemplate: {} as PageTemplate,
        }}
        lang="en"
        url="/"
        step={false}
      >
        children
      </ToggleFormProvider>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly as new org user form', async () => {
    const { container, getByTestId } = render(
      <ToggleFormProvider
        entry={{
          data: {
            flow: FormType.NEW_ORG,
          },
          errors: [],
        }}
        assetPath=""
        page={{
          pageTemplate: {} as PageTemplate,
        }}
        step={false}
        lang="en"
        url="/"
      >
        children
      </ToggleFormProvider>,
    );
    expect(container).toMatchSnapshot();

    const signupOrg = getByTestId('signupOrg');

    await waitFor(() => {
      fireEvent.submit(signupOrg);
    });
  });

  it('renders correctly as existing org user', async () => {
    const { container, getByTestId } = render(
      <ToggleFormProvider
        entry={{
          data: {
            flow: FormType.NEW_ORG_USER,
          },
          errors: [],
        }}
        assetPath=""
        page={{
          pageTemplate: {} as PageTemplate,
        }}
        lang="en"
        url="/"
        step={false}
      >
        children
      </ToggleFormProvider>,
    );
    expect(container).toMatchSnapshot();

    const signupOrg = getByTestId('signupUser');

    await waitFor(() => {
      fireEvent.submit(signupOrg);
    });
  });

  it('renders correctly as new org with errors', async () => {
    const { container } = render(
      <ToggleFormProvider
        entry={{
          data: {
            flow: FormType.NEW_ORG,
          },
          errors: [
            {
              field: 'organisationName',
              type: 'too_small',
            },
          ],
        }}
        assetPath=""
        page={{
          pageTemplate: {} as PageTemplate,
        }}
        lang="en"
        url="/"
        step={false}
      >
        children
      </ToggleFormProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
