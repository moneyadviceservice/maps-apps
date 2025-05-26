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
        formType={FormType.ACTIVE_ORG}
        errors={{}}
        onSubmit={() => {
          console.log('submit');
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly existing user', () => {
    const { container } = render(
      <SignUpUser
        formType={FormType.NEW_ORG_USER}
        errors={{}}
        onSubmit={() => {
          console.log('submit');
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with errors', () => {
    const { container } = render(
      <SignUpUser
        formType={FormType.ACTIVE_ORG}
        errors={{
          firstName: ['error - error'],
        }}
        onSubmit={() => {
          console.log('submit');
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
