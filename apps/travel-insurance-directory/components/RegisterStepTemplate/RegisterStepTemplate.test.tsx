import { ReactNode } from 'react';

import { CopyItem, PageContent } from 'data/pages/register/types';
import { render, screen } from '@testing-library/react';

import { RegisterStepTemplate } from './RegisterStepTemplate';

interface MockProps {
  children?: ReactNode;
}

interface FormWrapperMockProps extends MockProps {
  currentStep: string;
  className?: string;
}

interface RadioMockProps {
  initialValue: string;
}

interface DirectoryMockProps extends MockProps {
  heading: string;
}

jest.mock('components/ContentFactory', () => ({
  ContentFactory: ({ children }: MockProps) => (
    <div data-testid="content-factory">{children}</div>
  ),
}));

jest.mock('components/FormWrapper', () => ({
  FormWrapper: ({ children, currentStep, className }: FormWrapperMockProps) => (
    <div
      data-testid="form-wrapper"
      data-step={currentStep}
      className={className}
    >
      {children}
    </div>
  ),
}));

jest.mock('components/RadioQuestion', () => ({
  RadioQuestion: ({ initialValue }: RadioMockProps) => (
    <div data-testid="radio-question">{initialValue}</div>
  ),
}));

jest.mock('pages', () => ({
  TravelInsuranceDirectory: ({ children, heading }: DirectoryMockProps) => (
    <div data-testid="directory">
      <h1>{heading}</h1>
      {children}
    </div>
  ),
}));

describe('RegisterStepTemplate', () => {
  const createMockPageData = (key: string): PageContent => ({
    heading: 'Test Heading',
    backLink: '/back',
    copy: [] as CopyItem[],
    radioInput: {
      key,
      title: 'Question Title',
      options: [{ label: 'Yes', value: 'yes' }],
      layout: 'row',
    },
  });

  const stepKey: `step${number}` = 'step1';
  const radioKey = 'test_radio_key';

  const mockPageDataMap: Record<`step${number}`, PageContent> = {
    [stepKey]: createMockPageData(radioKey),
  };

  const defaultProps = {
    step: stepKey,
    initialErrors: null,
    initialValues: { [radioKey]: 'yes' },
    pageDataMap: mockPageDataMap,
    currentPath: '/register/firm' as const,
    isChangeAnswer: false,
  };

  it('renders correctly with page data', () => {
    render(<RegisterStepTemplate {...defaultProps} />);
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
  });

  it('passes the correct defaultValue to RadioQuestion based on initialValues', () => {
    render(<RegisterStepTemplate {...defaultProps} />);
    expect(screen.getByTestId('radio-question')).toHaveTextContent('yes');
  });

  it('passes the custom wrapperClassName to the FormWrapper', () => {
    const customClass = 'my-custom-layout';
    render(
      <RegisterStepTemplate {...defaultProps} wrapperClassName={customClass} />,
    );

    expect(screen.getByTestId('form-wrapper')).toHaveClass(customClass);
  });

  it('returns null if the step does not exist in pageDataMap', () => {
    const invalidStep = 'step99';
    const { container } = render(
      <RegisterStepTemplate {...defaultProps} step={invalidStep} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
