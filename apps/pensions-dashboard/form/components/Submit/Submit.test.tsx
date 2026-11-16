import { render, screen } from '@testing-library/react';

import {
  mockEntry,
  mockSteps,
  mockUseTranslation,
} from '@maps-react/mhf/mocks';

import { Submit } from '.';
import en from '../../../public/locales/taking-part/en.json';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

describe('Submit Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      locale: 'en',
    });
  });

  it('renders the thanks copy and Continue button', () => {
    render(<Submit entry={mockEntry} step="submit" />);

    expect(screen.getByTestId('submit-content')).toHaveTextContent(
      'taking-part/components.submit.content',
    );
    expect(screen.getByTestId('form-button')).toBeInTheDocument();
  });

  it('matches the approved English copy', () => {
    expect(en.components.submit.title).toBe(
      'You’re about to visit the Pensions Dashboard',
    );
    expect(en.components.submit.content).toBe(
      "Thanks for agreeing to take part in our research. You're now ready to start using the MoneyHelper Pensions Dashboard.",
    );
  });

  it('renders component correctly', () => {
    const { container } = render(
      <Submit entry={mockEntry} step={mockSteps[0]} />,
    );
    expect(container).toMatchSnapshot();
  });
});
