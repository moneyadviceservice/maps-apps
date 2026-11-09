import type { ReactNode } from 'react';

import { CopyItem, PageContent } from 'data/pages/register/types';
import { render, screen } from '@testing-library/react';

import { RegisterStepTemplate } from './RegisterStepTemplate';

const mockErrorSummaryProvider = jest.fn();
const mockTravelInsuranceDirectory = jest.fn();
const mockFormWrapper = jest.fn();
const mockRadioQuestion = jest.fn();

type ErrorSummaryProviderProps = {
  children: (args: { errorSummarySection: ReactNode }) => ReactNode;
  initialErrors: unknown;
  isRadio: boolean;
};

type RadioQuestionProps = {
  initialValue: string;
};

jest.mock('context/ErrorSummaryProvider', () => ({
  ErrorSummaryProvider: (props: ErrorSummaryProviderProps) => {
    mockErrorSummaryProvider(props);

    return props.children({
      errorSummarySection: <div data-testid="error-summary" />,
    });
  },
}));

jest.mock('layouts/TravelInsuranceDirectory', () => ({
  TravelInsuranceDirectory: ({
    children,
    heading,
    ...directoryProps
  }: {
    children: ReactNode;
    heading?: string;
    [key: string]: unknown;
  }) => {
    mockTravelInsuranceDirectory({ heading, ...directoryProps });

    return (
      <div data-testid="travel-insurance-directory">
        {heading && <h1>{heading}</h1>}
        {children}
      </div>
    );
  },
}));

jest.mock('components/ContentFactory', () => ({
  ContentFactory: ({ children }: { children: ReactNode }) => (
    <div data-testid="content-factory">{children}</div>
  ),
}));

jest.mock('components/FormWrapper', () => ({
  FormWrapper: ({
    children,
    currentStep,
    className,
    ...formProps
  }: {
    children: ReactNode;
    currentStep: string;
    className?: string;
    [key: string]: unknown;
  }) => {
    mockFormWrapper({ currentStep, className, ...formProps });

    return (
      <div
        data-testid="form-wrapper"
        data-step={currentStep}
        className={className}
      >
        {children}
      </div>
    );
  },
}));

jest.mock('components/form/RadioQuestion', () => ({
  RadioQuestion: (props: RadioQuestionProps) => {
    mockRadioQuestion(props);

    return <div data-testid="radio-question">{props.initialValue}</div>;
  },
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
    currentFlow: 'firm' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children and passes props to its dependencies', () => {
    render(<RegisterStepTemplate {...defaultProps} />);

    expect(screen.getByText('Test Heading')).toBeInTheDocument();
    expect(screen.getByTestId('radio-question')).toHaveTextContent('yes');

    expect(mockErrorSummaryProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        initialErrors: null,
        isRadio: true,
      }),
    );

    expect(mockTravelInsuranceDirectory).toHaveBeenCalledWith(
      expect.objectContaining({
        browserTitle: 'Register - Test Heading',
        backLink: '/back',
        displayBacklink: true,
        heading: 'Test Heading',
        showLanguageSwitcher: false,
        currentFlow: 'firm',
      }),
    );

    expect(mockFormWrapper).toHaveBeenCalledWith(
      expect.objectContaining({
        formAction: '/api/register/radio-submit?isChangeAnswer=false',
        currentPath: '/register/firm',
        currentStep: 'step1',
        className: 'mt-6',
      }),
    );

    expect(mockRadioQuestion).toHaveBeenCalledWith(
      expect.objectContaining({
        initialValue: 'yes',
      }),
    );
  });

  it('prefills nested firm fields from full firm document', () => {
    render(
      <RegisterStepTemplate
        {...defaultProps}
        step={'step2' as const}
        pageDataMap={{
          step2: {
            heading: 'Medical risk',
            backLink: '/register/firm/step1',
            copy: [],
            radioInput: {
              key: 'risk_profile_approach_question',
              layout: 'column',
              options: [{ label: 'Bespoke', value: 'bespoke' }],
            },
          },
        }}
        initialValues={{
          medical_coverage: {
            risk_profile_approach_question: 'bespoke',
          },
        }}
      />,
    );

    expect(mockRadioQuestion).toHaveBeenCalledWith(
      expect.objectContaining({
        initialValue: 'bespoke',
      }),
    );
  });

  it('passes the custom wrapperClassName to FormWrapper', () => {
    render(
      <RegisterStepTemplate
        {...defaultProps}
        wrapperClassName="my-custom-layout"
      />,
    );

    expect(mockFormWrapper).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'my-custom-layout',
      }),
    );
  });

  it('returns null if the step does not exist in pageDataMap', () => {
    const { container } = render(
      <RegisterStepTemplate {...defaultProps} step={'step99' as const} />,
    );

    expect(container.firstChild).toBeNull();
    expect(mockTravelInsuranceDirectory).not.toHaveBeenCalled();
  });
});
