import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { FormError } from '../../lib/types';
import { Name } from './Name';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;
describe('Name Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });
  it('renders the component with no errors', () => {
    const { container } = render(<Name step="mock-step" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders an error message for the first-name field when there is an error', () => {
    const mockErrors: FormError = { 'first-name': ['First name is required'] };
    const { container } = render(<Name errors={mockErrors} step="mock-step" />);

    // Check that the error message for first-name is rendered
    expect(
      screen.getByText('components.name.form.first-name.error'),
    ).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders an error message for the last-name field when there is an error', () => {
    const mockErrors: FormError = { 'last-name': ['Last name is required'] };

    const { container } = render(<Name errors={mockErrors} step="mock-step" />);

    // Check that the error message for last-name is rendered
    expect(
      screen.getByText('components.name.form.last-name.error'),
    ).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
