import { useAboutYouForm } from 'hooks/useAboutYouForm';
import { defaultAboutYouData } from 'types/aboutYou';
import { render, screen } from '@testing-library/react';

import { AboutYouForm } from './AboutYouForm';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: {},
    pathname: '/en/about-you',
  }),
}));

jest.mock('@maps-react/hooks/useLanguage', () => ({
  useContextLanguage: () => 'en',
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: ({ en }: { en: string; cy: string }) => en,
  }),
}));

const Wrapper = () => {
  const form = useAboutYouForm({
    sessionId: 'abc',
    initialData: defaultAboutYouData(),
    initialErrors: {},
  });

  return <AboutYouForm form={form} />;
};

const wrapper = () => render(<Wrapper />);

describe('AboutYouForm', () => {
  it('renders the about you questions and continue', () => {
    wrapper();

    expect(
      screen.getByRole('group', { name: 'What is your date of birth?' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'What is your sex?' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Male')).not.toBeChecked();
    expect(screen.getByLabelText('Female')).not.toBeChecked();
    expect(
      screen.getByRole('button', { name: 'Continue' }),
    ).toBeInTheDocument();
  });
});
