import { render } from '@testing-library/react';

import { LoginConfirmOrg } from './LoginConfirmOrg';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: (z: { en: string }) => (typeof z === 'string' ? z : z.en),
  }),
}));

describe('LoginConfirmOrg', () => {
  it('renders component', () => {
    render(
      <LoginConfirmOrg
        user={{ referrerId: 'ABC123' }}
        formErrors={[] as unknown as Record<string, string[]>}
      />,
    );
  });
});
