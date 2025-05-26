import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { FormError } from '../../lib/types';
import { Enquiry } from './Enquiry';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

describe('Enquiry Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      z: (translations: { en: JSX.Element; cy: JSX.Element }) =>
        translations.en, // Always return the English translation for tests
    });
  });

  it('renders the component with title and form', () => {
    const { container } = render(<Enquiry />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with errors', () => {
    const mockErrors: FormError[] = [
      { field: 'text-area', message: 'Description is required' },
    ];

    const { container } = render(<Enquiry errors={mockErrors} />);

    expect(
      screen.getByText('components.enquiry.form.text-area.error'),
    ).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
