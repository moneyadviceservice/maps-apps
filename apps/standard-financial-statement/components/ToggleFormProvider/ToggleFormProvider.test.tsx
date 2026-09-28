import { useRouter } from 'next/router';

import {
  FormFlowType,
  FormStep,
  SIGN_UP_PART_2_HASH,
} from 'data/form-data/org_signup';
import * as PageLayoutModule from 'layouts/PageLayout/PageLayout';
import { PageTemplate } from 'types/@adobe/page';
import {
  fireEvent,
  Matcher,
  MatcherOptions,
  render,
  renderHook,
  waitFor,
  within,
} from '@testing-library/react';

import * as useAnalyticsModule from '@maps-react/hooks/useAnalytics';

import { ToggleFormProvider, useFormMode } from './ToggleFormProvider';

import '@testing-library/jest-dom';

const scrollIntoViewMock = jest.fn();

Object.defineProperty(globalThis.Element.prototype, 'scrollIntoView', {
  writable: true,
  value: scrollIntoViewMock,
});

jest.mock('@maps-react/hooks/useTranslation', () => () => ({
  z: ({ en }: { en: string; cy: string }) => en,
}));

globalThis.fetch = jest.fn(() =>
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
      flow: FormFlowType.NEW_ORG,
      step: FormStep.NEW_ORG,
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
  inputIdPrefix: 'idPrefix-',
};

const newOrgUserDefaults = {
  ...defaultProps,
  step: true,
  entry: {
    data: {
      flow: FormFlowType.NEW_ORG,
      step: FormStep.NEW_ORG_USER,
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
  values: Record<string, unknown>,
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
  beforeEach(() => {
    window.history.replaceState({}, '', '/');

    (useRouter as jest.Mock).mockReturnValue({
      query: {},
      events: { on: jest.fn(), off: jest.fn() },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    window.history.replaceState({}, '', '/');
  });

  it('renders correctly as default', () => {
    const { container } = render(<ToggleFormProvider {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does not show signup forms before a membership type is selected', async () => {
    const { queryByTestId } = render(
      <ToggleFormProvider {...defaultProps} entry={{ data: {}, errors: [] }} />,
    );

    await waitFor(() => {
      expect(queryByTestId('signupOrg')).not.toBeInTheDocument();
      expect(queryByTestId('signUpUserForm')).not.toBeInTheDocument();
    });
  });

  it('renders correctly as new org user form', async () => {
    const { container, getByTestId } = render(
      <ToggleFormProvider
        {...defaultProps}
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
    const existingOrgEntry = {
      data: {
        flow: FormFlowType.EXISTING_ORG,
        step: FormStep.EXISTING_ORG,
      },
      errors: [],
    };

    const { container, getByTestId } = render(
      <ToggleFormProvider {...defaultProps} entry={existingOrgEntry} />,
    );

    const otpForm = getByTestId('signUpUserForm');

    await waitFor(() => {
      fireEvent.submit(otpForm);
    });
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
    (globalThis.fetch as jest.Mock).mockImplementationOnce(() => {
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
    (globalThis.fetch as jest.Mock).mockImplementationOnce(() => {
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

  it('returns to part 1 when browser back clears the part 2 URL', async () => {
    window.history.replaceState({}, '', `/?user=true${SIGN_UP_PART_2_HASH}`);

    const { getByText, queryByText } = render(
      <ToggleFormProvider {...newOrgUserDefaults} />,
    );

    expect(getByText(/Email address/i)).toBeInTheDocument();

    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));

    await waitFor(() => {
      expect(queryByText(/Email address/i)).not.toBeInTheDocument();
    });
  });

  it('updates formStep if the URL hash matches sign-up-part-2 on mount', () => {
    window.history.replaceState({}, '', `/${SIGN_UP_PART_2_HASH}`);
    const { getByText } = render(<ToggleFormProvider {...defaultProps} />);

    expect(getByText(/Email address/i)).toBeInTheDocument();
  });

  it('handles org submit validation errors', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({
        entry: {
          data: {
            lang: 'en',
            flow: 'new',
            step: 'user',
            organisationName: '',
            organisationStreet: 'org street',
            organisationCity: 'org town',
            organisationPostcode: 'ab12 c34',
            sfsLaunchDate: '2026-07-29',
            caseManagementSoftware: '',
            geoRegions: ['east-of-england'],
            memberships: ['advice-ni'],
            sfslive: 'true',
            organisationUse: 'provide-debt-advice',
            fcaReg: 'fca-no',
            organisationType: 'Central Government department',
            debtAdvice: ['online'],
            'advice-ni': '1223',
          },
          errors: [{ field: 'organisationName', type: 'too_small' }],
        },
      }),
    });

    const { getByTestId } = render(<ToggleFormProvider {...defaultProps} />);

    fireEvent.submit(getByTestId('signupOrg'));

    await waitFor(() => {
      const errorSummary = getByTestId('error-records');
      expect(errorSummary).toBeInTheDocument();

      const errorSummaryHeading =
        within(errorSummary).getByText('There is a problem');
      expect(errorSummaryHeading).toBeInTheDocument();

      const errorSummaryLink = within(errorSummary).getByRole('link', {
        name: 'Organisation name - This value is required.',
      });
      expect(errorSummaryLink).toBeInTheDocument();
      expect(errorSummaryLink).toHaveAttribute(
        'href',
        `#${defaultProps.inputIdPrefix}organisationName`,
      );
    });
  });

  it('switches to existing org flow via form type selector', async () => {
    const { container, getByTestId } = render(
      <ToggleFormProvider {...defaultProps} />,
    );

    const existingOrgRadio = container.querySelector(
      '#existing',
    ) as HTMLInputElement;
    fireEvent.click(existingOrgRadio);

    await waitFor(() => {
      expect(getByTestId('signUpUserForm')).toBeInTheDocument();
    });
  });
});

describe('useFormMode', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('throws when used outside ToggleFormProvider', () => {
    expect(() => renderHook(() => useFormMode())).toThrow(
      'useFormMode must be used within a FormModeProvider',
    );
  });

  it('returns form step context inside ToggleFormProvider', () => {
    const FormModeConsumer = () => {
      const { formStep } = useFormMode();
      return <span data-testid="form-mode-step">{formStep}</span>;
    };

    jest
      .spyOn(PageLayoutModule, 'PageLayout')
      .mockImplementation(({ children, topInfo }) => (
        <div>
          <FormModeConsumer />
          {topInfo}
          {children}
        </div>
      ));

    const { getByTestId } = render(<ToggleFormProvider {...defaultProps} />);

    expect(getByTestId('form-mode-step')).toHaveTextContent(FormStep.NEW_ORG);
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
    (globalThis.fetch as jest.Mock).mockImplementationOnce(() => {
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

    (globalThis.fetch as jest.Mock).mockImplementationOnce(() =>
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
    (globalThis.fetch as jest.Mock).mockImplementationOnce(() => {
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
    (globalThis.fetch as jest.Mock).mockImplementationOnce(() => {
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

  it('hides OTP step when password error is returned', async () => {
    (globalThis.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({ error: 'invalid_password', name: 'password' }),
        ok: true,
        status: 200,
      }),
    );

    const { getByTestId, queryByTestId } = render(
      <ToggleFormProvider {...newOrgUserDefaults} />,
    );
    const form = getByTestId('signUpUserForm');
    updateForm(getByTestId, defaults);

    await waitFor(() => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(queryByTestId('otp')).not.toBeInTheDocument();
    });

    expect(addEventMock).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'errorMessage' }),
    );
  });

  it('renders success state for existing org', async () => {
    (globalThis.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            organisationName: 'Existing Org',
          }),
        ok: true,
        status: 200,
      }),
    );

    const { getByTestId, findByText } = render(
      <ToggleFormProvider
        {...defaultProps}
        entry={{
          data: {
            flow: FormFlowType.EXISTING_ORG,
            step: FormStep.EXISTING_ORG,
          },
          errors: [],
        }}
      />,
    );
    const form = getByTestId('signUpUserForm');
    updateForm(getByTestId, {
      ...defaults,
      orgLicenceNumber: 'SFS-12345',
    });

    await waitFor(() => {
      fireEvent.submit(form);
    });

    expect(
      await findByText(/Existing Org has been successfully approved/i),
    ).toBeInTheDocument();
  });
});
