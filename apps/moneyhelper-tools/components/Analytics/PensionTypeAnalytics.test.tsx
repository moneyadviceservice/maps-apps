import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PensionTypeAnalytics } from './PensionTypeAnalytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('./Analytics', () => ({
  Analytics: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('PensionTypeAnalytics', () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      z: jest.fn((key) => key),
    });
  });

  const mockFormData = {
    field1: 'value1',
    field2: 'value2',
  };

  const mockCurrentStep = 3;

  it('renders the Analytics component with correct props', () => {
    render(
      <PensionTypeAnalytics
        currentStep={mockCurrentStep}
        formData={mockFormData}
      >
        <p>Child content</p>
      </PensionTypeAnalytics>,
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('passes correct props to Analytics when error is provided', () => {
    const mockError = {
      reactCompType: 'TestType',
      reactCompName: 'TestComponent',
      errorMessage: 'Test error message',
    };

    render(
      <PensionTypeAnalytics
        currentStep={mockCurrentStep}
        formData={mockFormData}
        error={mockError}
      >
        <p>Child content</p>
      </PensionTypeAnalytics>,
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
    expect(screen.queryByText('Test error message')).not.toBeInTheDocument();
  });
});
