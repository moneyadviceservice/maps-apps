import { FormFlowType, FormStep } from 'data/form-data/org_signup';
import { render } from '@testing-library/react';

import SignUpUser from './SignUpUser';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => () => ({
  z: ({ en }: { en: string; cy: string }) => en,
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('SignUpOrg', () => {
  it('renders correctly as new user', () => {
    const { container } = render(
      <SignUpUser
        onSubmit={jest.fn()}
        onChange={jest.fn()}
        emailAddress=""
        formStep={FormStep.EXISTING_ORG}
        formFlowType={FormFlowType.EXISTING_ORG}
        errors={{}}
        showOTP={false}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly existing user', () => {
    const { container } = render(
      <SignUpUser
        onSubmit={jest.fn()}
        showOTP={false}
        onChange={jest.fn()}
        emailAddress=""
        formStep={FormStep.NEW_ORG_USER}
        formFlowType={FormFlowType.NEW_ORG}
        errors={{}}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with errors', () => {
    const { container } = render(
      <SignUpUser
        onSubmit={jest.fn()}
        showOTP={false}
        onChange={jest.fn()}
        emailAddress=""
        formStep={FormStep.EXISTING_ORG}
        formFlowType={FormFlowType.EXISTING_ORG}
        errors={{
          firstName: ['error - error'],
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with continuationToken and OTP input', () => {
    const { container } = render(
      <SignUpUser
        onSubmit={jest.fn()}
        onChange={jest.fn()}
        emailAddress=""
        showOTP={true}
        formStep={FormStep.NEW_ORG_USER}
        formFlowType={FormFlowType.NEW_ORG}
        errors={{}}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
