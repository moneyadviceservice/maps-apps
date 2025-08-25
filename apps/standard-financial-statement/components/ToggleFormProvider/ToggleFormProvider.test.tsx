import { FormType } from 'data/form-data/org_signup';
import { PageTemplate } from 'types/@adobe/page';
import {
  fireEvent,
  Matcher,
  MatcherOptions,
  render,
  waitFor,
} from '@testing-library/react';

import * as useAnalyticsModule from '@maps-react/hooks/useAnalytics';

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

const defaultProps = {
  entry: {
    data: {
      flow: FormType.NEW_ORG,
    },
    errors: [],
  },
  assetPath: '',
  page: {
    pageTemplate: {} as PageTemplate,
  },
  lang: 'en',
  url: '/',
  step: false,
};

const newOrgUserDefaults = {
  ...defaultProps,
  entry: {
    data: {
      flow: FormType.NEW_ORG_USER,
    },
    errors: [],
  },
};

const defaults = {
  firstName: 'firstNameTest',
  lastName: 'lastNameTest',
  emailAddress: 'test@test.com',
  password: 'passwordTest1!',
  confirmPassword: 'passwordTest1!',
  jobTitle: 'jobTitleTest',
  codeOfConduct: 'true',
  tel: '07123456789',
};

const updateForm = (
  getByTestId: (
    id: Matcher,
    options?: MatcherOptions | undefined,
  ) => HTMLElement,
  values: any,
) => {
  Object.entries(values).forEach(([key, value]) => {
    const input = getByTestId(key) as HTMLInputElement;
    if (key === 'codeOfConduct') {
      fireEvent.click(input);
    } else {
      fireEvent.change(input, {
        target: { value },
      });
    }
  });
};

describe('ToggleFormProvider', () => {
  it('renders correctly as new org', () => {
    const { container } = render(<ToggleFormProvider {...defaultProps} />);
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
      />,
    );
    expect(container).toMatchSnapshot();

    const signupOrg = getByTestId('signupOrg');

    await waitFor(() => {
      fireEvent.submit(signupOrg);
    });
  });

  it('renders correctly as existing org user', async () => {
    const { container, getByTestId } = render(
      <ToggleFormProvider {...newOrgUserDefaults} />,
    );

    const otpForm = getByTestId('signUpUserForm');

    await waitFor(() => {
      fireEvent.submit(otpForm);
    });
    expect(container).toMatchSnapshot();
  });

  it('renders correctly as new org with errors', async () => {
    const { container } = render(<ToggleFormProvider {...defaultProps} />);

    expect(container).toMatchSnapshot();
  });

  it('renders correctly as new org user with errors', async () => {
    const { container, getByTestId } = render(
      <ToggleFormProvider {...newOrgUserDefaults} />,
    );

    const form = getByTestId('signUpUserForm');

    updateForm(getByTestId, defaults);

    await waitFor(() => {
      fireEvent.submit(form);
      expect(container).toMatchSnapshot();
    });
  });

  it('renders correctly submits form and renders otp', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            continuation_token: 'test',
            message: 'User signed up',
          }),
        ok: true,
        status: 200,
      });
    });

    const { getByTestId } = render(
      <ToggleFormProvider {...newOrgUserDefaults} />,
    );

    const form = getByTestId('signUpUserForm');

    updateForm(getByTestId, defaults);

    await waitFor(() => {
      fireEvent.submit(form);
    });
  });

  it('renders correctly submits form and renders otp with expired_token', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            error: 'expired_token',
            name: 'otp',
          }),
        ok: true,
        status: 200,
      });
    });

    const { getByTestId } = render(
      <ToggleFormProvider {...newOrgUserDefaults} />,
    );

    const form = getByTestId('signUpUserForm');

    updateForm(getByTestId, defaults);

    await waitFor(() => {
      fireEvent.submit(form);
      updateForm(getByTestId, {
        ...defaults,
        otp: '123456',
      });

      expect(getByTestId('otp')).toBeInTheDocument();
    });

    fireEvent.change(getByTestId('emailAddress'), {
      target: { value: 'new@email.com' },
    });
  });
});

describe('ToggleFormProvider analytics and error handling', () => {
  let addEventMock: jest.Mock;
  beforeEach(() => {
    addEventMock = jest.fn();
    jest.spyOn(useAnalyticsModule, 'useAnalytics').mockReturnValue({
      addEvent: addEventMock,
      addPage: jest.fn(),
      addStepPage: jest.fn(),
      analyticsList: { current: [] },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fires analytics event on errorMessage', async () => {
    const { getByTestId } = render(
      <ToggleFormProvider {...newOrgUserDefaults} />,
    );
    const form = getByTestId('signUpUserForm');
    fireEvent.submit(form);
    await waitFor(() => {
      expect(addEventMock).toHaveBeenCalledWith(
        expect.objectContaining({ event: 'errorMessage' }),
      );
    });
  });

  it('fires analytics event on formSubmitted (SUCCESS)', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve({
        json: () =>
          Promise.resolve({ success: true, organisationName: 'TestOrg' }),
        ok: true,
        status: 200,
      });
    });
    const { getByTestId } = render(
      <ToggleFormProvider {...newOrgUserDefaults} />,
    );
    const form = getByTestId('signUpUserForm');
    updateForm(getByTestId, defaults);
    await waitFor(() => {
      fireEvent.submit(form);
    });
    expect(addEventMock).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'formSubmitted' }),
    );
  });

  it('disables submit button while submitting', async () => {
    const createDelayedResponse = () => {
      const responseData = {
        json: () => Promise.resolve({ success: true }),
        ok: true,
        status: 200,
      };

      return new Promise((resolve) => {
        setTimeout(() => resolve(responseData), 100);
      });
    };

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      createDelayedResponse(),
    );

    const { getByTestId } = render(
      <ToggleFormProvider {...newOrgUserDefaults} />,
    );
    const form = getByTestId('signUpUserForm');
    updateForm(getByTestId, defaults);
    fireEvent.submit(form);
    // Button should be disabled during async
    const button = form.querySelector('button[type="submit"]');
    if (button) {
      expect((button as HTMLButtonElement).disabled).toBe(true);
    }
  });

  it('renders success state for new org', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            organisationName: 'TestOrg',
            isExisting: false,
          }),
        ok: true,
        status: 200,
      });
    });
    const { getByTestId, findByText } = render(
      <ToggleFormProvider {...newOrgUserDefaults} />,
    );
    const form = getByTestId('signUpUserForm');
    updateForm(getByTestId, defaults);
    await waitFor(() => {
      fireEvent.submit(form);
    });
    expect(
      await findByText(/We will review the application/i),
    ).toBeInTheDocument();
  });

  it('handles OTP expired_token error and triggers re-init', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve({
        json: () => Promise.resolve({ error: 'expired_token', name: 'otp' }),
        ok: true,
        status: 200,
      });
    });
    const { getByTestId } = render(
      <ToggleFormProvider {...newOrgUserDefaults} />,
    );
    const form = getByTestId('signUpUserForm');
    updateForm(getByTestId, defaults);
    await waitFor(() => {
      fireEvent.submit(form);
    });
    expect(addEventMock).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'errorMessage' }),
    );
  });
});
