import { render, screen } from '@testing-library/react';

import { RBPInformationCallout } from './RBPInformationCallout';
import { mockTranslationDataEn } from 'lib/mocks/mockUseTranslations';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => {
  return {
    __esModule: true,
    default: () => ({
      t: (key: string) => mockTranslationDataEn[key] ?? key,
      tList: (key: string) => mockTranslationDataEn[key] ?? key,
      locale: 'en',
    }),
  };
});

describe('test RBPInformationCallout component', () => {
  it('should render the component', () => {
    const { container } = render(<RBPInformationCallout />);
    expect(container).toMatchSnapshot();

    expect(
      screen.getByRole('heading', {
        name: 'Need more information on pensions?',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'One of our pension specialists will be happy to answer your questions. You can:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'use our webchat' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/call us on/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '0800 011 3797' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '+44 20 7932 5780' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/if you’re outside the UK/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'use our online form' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'We’re open between 9am and 5pm, Monday to Friday. Closed on bank holidays.',
      ),
    ).toBeInTheDocument();
  });
});
