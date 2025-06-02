import { FormType } from 'data/form-data/org_signup';
import { render } from '@testing-library/react';

import SignUpUser from './SignUpUser';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => () => ({
  z: ({ en }: { en: string; cy: string }) => en,
}));

describe('SignUpOrg', () => {
  it('renders correctly as new user', () => {
    const { container } = render(
      <SignUpUser
        onSubmit={jest.fn()}
        formType={FormType.ACTIVE_ORG}
        errors={{}}
        continuationToken=""
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
        continuationToken=""
        formType={FormType.NEW_ORG_USER}
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
        continuationToken=""
        formType={FormType.ACTIVE_ORG}
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
        showOTP={true}
        continuationToken="1234"
        formType={FormType.NEW_ORG_USER}
        errors={{}}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
