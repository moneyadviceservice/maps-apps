import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { mockErrors, mockSteps } from '../../mocks';
import { FormErrorCallout } from './FormErrorCallout';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

describe('FormErrorCallout', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  it('should render with errors', () => {
    const { container } = render(
      <FormErrorCallout errors={mockErrors} step={mockSteps[0]} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('moves focus to the error summary when errors appear', () => {
    const { rerender } = render(
      <FormErrorCallout errors={undefined} step={mockSteps[0]} />,
    );

    rerender(<FormErrorCallout errors={mockErrors} step={mockSteps[0]} />);

    const errorSummary = screen.getByTestId('error-summary-container');

    expect(errorSummary).toHaveAttribute('tabindex', '-1');
    expect(errorSummary).toHaveFocus();
  });

  it('should render null if errors are undefined', () => {
    const { container } = render(
      <FormErrorCallout errors={undefined} step={mockSteps[0]} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render null if errors are empty', () => {
    const { container } = render(
      <FormErrorCallout errors={undefined} step={mockSteps[0]} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
