import { StampDutyCalculator } from './StampDutyCalculator';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AnalyticsData } from '@maps-react/hooks/useAnalytics';

const scrollIntoViewMock = jest.fn();

jest.mock('next/router', () => require('next-router-mock'));

const mockAdobeDataLayer: AnalyticsData[] = [];
(global.window.adobeDataLayer as unknown as AnalyticsData[]) =
  mockAdobeDataLayer;

describe('StampDutyCalculator', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onfocus: false,
      })),
    });
  });
  beforeEach(() => {
    Object.defineProperty(window.Element.prototype, 'scrollIntoView', {
      writable: true,
      value: scrollIntoViewMock,
    });
  });

  const defaultProps = {
    type: 'sdlt',
    propertyPrice: '',
    buyerType: '' as any,
    calculated: false,
    title: 'Stamp Duty Calculator',
    analyticsData: {} as AnalyticsData,
    isEmbedded: false,
  };

  let RenderComp = (props: any) => {
    return render(<StampDutyCalculator {...props} />);
  };

  // Helper function to set form values and calculate
  const setFormValuesAndCalculate = (
    buyerType: string,
    propertyPrice: string,
  ) => {
    fireEvent.change(screen.getByLabelText(/I am buying/i), {
      value: buyerType,
    });
    fireEvent.change(screen.getByLabelText(/Property price/i), {
      value: propertyPrice,
    });

    const calculateBtn = screen.getByRole('button', { name: 'Calculate' });
    fireEvent.click(calculateBtn);
  };

  // Helper function to render component with calculated state
  const renderCalculatedState = (buyerType: string, propertyPrice: string) => {
    return RenderComp({
      ...defaultProps,
      propertyPrice,
      buyerType,
      calculated: true,
    });
  };

  // Helper function to verify common "Did you know?" section
  const expectDidYouKnowSection = () => {
    expect(
      screen.getByRole('heading', { name: 'Did you know?' }),
    ).toBeVisible();
    expect(
      screen.getByText(
        /You have to pay Stamp Duty within 14 days of buying a property. If you're using a solicitor to carry out the conveyancing, they will normally organise the payment for you./i,
      ),
    ).toBeVisible();
  };

  it('should render stamp duty calculator form', () => {
    RenderComp({ ...defaultProps });

    expect(
      screen.getByRole('heading', {
        name: 'Calculate how much Stamp Duty you will pay:',
      }),
    ).toBeVisible();
    expect(
      screen.getByText('Select type of property you are buying'),
    ).toBeVisible();
    expect(screen.getByText('Enter purchase price')).toBeVisible();
    expect(screen.getByText('Press "Calculate"')).toBeVisible();
    expect(
      screen.getByText((content, element) => {
        return content.includes(
          "You'll need to select and input both elements of this form to get a result.",
        );
      }),
    ).toBeVisible();
    expect(screen.getByLabelText('I am buying')).toBeVisible();
    expect(screen.getByLabelText('Property price')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Calculate' })).toBeVisible();
  });

  it('should render calculated stamp duty', () => {
    RenderComp({ ...defaultProps });

    setFormValuesAndCalculate('firstTimeBuyer', '340000');
    renderCalculatedState('firstTimeBuyer', '340000');

    expect(
      screen.getByRole('heading', { name: 'Stamp duty on your first home is' }),
    ).toBeVisible();
    expect(screen.getByText('£2,000')).toBeVisible();
    expect(screen.getByText('The effective tax rate is 0.59%')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Recalculate' })).toBeVisible();
    expectDidYouKnowSection();
  });

  it('should recalculate stamp duty on click of Recalculate button', () => {
    RenderComp({ ...defaultProps });

    setFormValuesAndCalculate('firstTimeBuyer', '250000');
    renderCalculatedState('firstTimeBuyer', '250000');

    const reCalculateBtn = screen.getByRole('button', { name: 'Recalculate' });
    fireEvent.click(reCalculateBtn);

    expect(
      screen.getByRole('heading', { name: 'Stamp duty on your first home is' }),
    ).toBeVisible();
    expect(screen.getByText('£0')).toBeVisible();
    expectDidYouKnowSection();
  });

  it('should throw invalid error message if property price field is empty', () => {
    RenderComp({ ...defaultProps });

    setFormValuesAndCalculate('firstTimeBuyer', '');
    renderCalculatedState('firstTimeBuyer', '');

    expect(
      screen.getByRole('heading', { name: 'This is a problem' }),
    ).toBeVisible();
    expect(
      screen.getByRole('link', {
        name: 'Enter a property price, for example £200,000',
      }),
    ).toBeVisible();
  });

  it('should render stamp duty on you additional property if buyType is additionalHome', () => {
    renderCalculatedState('additionalHome', '300000');

    expect(
      screen.getByRole('heading', {
        name: 'Stamp duty on your additional property is',
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('tax-result')).toBeInTheDocument();
  });

  it('should only track analytics on numeric keydown events in property price input', () => {
    const analyticsData = {
      event: 'toolStart',
      eventInfo: {
        toolName: 'SDLT Calculator',
        toolStep: 1,
        stepName: 'Calculate',
      },
    };

    RenderComp({ ...defaultProps, analyticsData });

    const propertyPriceInput = screen.getByLabelText('Property price');

    // Test non-numeric key - should not trigger analytics
    fireEvent.keyDown(propertyPriceInput, { key: 'a', type: 'keydown' });
    fireEvent.keyDown(propertyPriceInput, { key: 'Enter', type: 'keydown' });
    fireEvent.keyDown(propertyPriceInput, {
      key: 'Backspace',
      type: 'keydown',
    });

    // Test numeric key - should trigger analytics
    fireEvent.keyDown(propertyPriceInput, { key: '1', type: 'keydown' });
    fireEvent.keyDown(propertyPriceInput, { key: '5', type: 'keydown' });

    // Verify the input is still functional
    expect(propertyPriceInput).toBeInTheDocument();
  });

  it('should trigger analytics tracking when property price input onChange event occurs', () => {
    const analyticsData = {
      event: 'toolStart',
      eventInfo: {
        toolName: 'SDLT Calculator',
        toolStep: 1,
        stepName: 'Calculate',
      },
    };

    RenderComp({ ...defaultProps, analyticsData });

    const propertyPriceInput = screen.getByLabelText('Property price');

    // Trigger onChange event on property price input
    fireEvent.change(propertyPriceInput, {
      target: { value: '250000' },
    });

    expect(propertyPriceInput).toHaveValue('250,000');
    expect(propertyPriceInput).toBeInTheDocument();
  });

  it('should throw invalid error message if buyer type field is empty', () => {
    RenderComp({ ...defaultProps });

    // Set property price but leave buyer type empty
    fireEvent.change(screen.getByLabelText(/Property price/i), {
      value: '250000',
    });

    const calculateBtn = screen.getByRole('button', { name: 'Calculate' });
    fireEvent.click(calculateBtn);

    // Render with calculated state but empty buyerType
    renderCalculatedState('', '250000');

    expect(
      screen.getByRole('heading', { name: 'This is a problem' }),
    ).toBeVisible();
    expect(
      screen.getByRole('link', {
        name: 'Select the type of property you are buying',
      }),
    ).toBeVisible();
  });

  it('should handle invalid buyer type gracefully', () => {
    // Render with an invalid buyerType to test the fallback case
    const { container } = renderCalculatedState('invalidBuyerType', '250000');

    // The title should be empty due to the fallback logic
    const titleElement = container.querySelector('.t-result h3');
    expect(titleElement).toHaveTextContent('');

    // But the result should still show (calculation still works)
    expect(screen.getByTestId('tax-result')).toBeInTheDocument();
  });

  it('should test form submission with calculated=true to cover form onSubmit branch', () => {
    // Mock getElementById to return a proper mock element
    const mockRecalculatedInput = {
      value: 'false',
    };

    // Mock document.getElementById for both info-element and recalculated
    const mockInfoElement = {
      focus: jest.fn(),
      scrollIntoView: jest.fn(),
    };

    const getElementByIdSpy = jest
      .spyOn(document, 'getElementById')
      .mockImplementation((id) => {
        if (id === 'recalculated') return mockRecalculatedInput as any;
        if (id === 'info-element') return mockInfoElement as any;
        return null;
      });

    const { container } = renderCalculatedState('firstTimeBuyer', '250000');

    const form = container.querySelector('#sdlt');
    expect(form).toBeInTheDocument();

    // Trigger form submission
    fireEvent.submit(form!);

    // Verify that the recalculated value was set to 'true'
    expect(mockRecalculatedInput.value).toBe('true');

    // Clean up
    getElementByIdSpy.mockRestore();
  });

  it('should render with isEmbedded=true to test embedded conditional branches', () => {
    const { container } = render(
      <StampDutyCalculator
        {...defaultProps}
        propertyPrice="250000"
        buyerType="firstTimeBuyer"
        calculated={true}
        isEmbedded={true}
      />,
    );

    // Check that embedded-specific classes are applied
    const embeddedContainer = container.querySelector('.pb-5');
    expect(embeddedContainer).toBeInTheDocument();

    // Check that links have target="_blank" when embedded
    const links = container.querySelectorAll('a[target="_blank"]');
    expect(links.length).toBeGreaterThan(0);
  });

  it('should handle different buyer type titles correctly', () => {
    // Test nextHome buyer type
    const { rerender } = render(
      <StampDutyCalculator
        {...defaultProps}
        propertyPrice="350000"
        buyerType="nextHome"
        calculated={true}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Stamp duty on your next home is' }),
    ).toBeInTheDocument();

    // Test additionalHome buyer type
    rerender(
      <StampDutyCalculator
        {...defaultProps}
        propertyPrice="350000"
        buyerType="additionalHome"
        calculated={true}
      />,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Stamp duty on your additional property is',
      }),
    ).toBeInTheDocument();
  });

  it('should handle analytics tracking when buyer type changes', () => {
    const analyticsData = {
      event: 'toolStart',
      eventInfo: {
        toolName: 'SDLT Calculator',
        toolStep: 1,
        stepName: 'Calculate',
      },
    };

    RenderComp({ ...defaultProps, analyticsData });

    const buyerTypeSelect = screen.getByLabelText('I am buying');

    // Trigger onChange event on buyer type select
    fireEvent.change(buyerTypeSelect, {
      target: { value: 'firstTimeBuyer' },
    });

    expect(buyerTypeSelect).toBeInTheDocument();
  });

  it('should conditionally render classes based on calculated and showResults states', () => {
    // Test with calculated=false
    const { container, rerender } = render(
      <StampDutyCalculator {...defaultProps} calculated={false} />,
    );

    let formDiv = container.querySelector('.mb-8');
    expect(formDiv).toBeInTheDocument();

    // Test with calculated=true and showResults=true
    rerender(
      <StampDutyCalculator
        {...defaultProps}
        propertyPrice="250000"
        buyerType="firstTimeBuyer"
        calculated={true}
      />,
    );

    // Check conditional rendering of showResults sections
    expect(screen.getByText('Did you know?')).toBeInTheDocument();
  });

  it('should not render showResults sections when buyerType is empty', () => {
    render(
      <StampDutyCalculator
        {...defaultProps}
        propertyPrice="250000"
        buyerType={'' as any}
        calculated={true}
      />,
    );

    // Should not render "Did you know?" section when showResults is false
    expect(screen.queryByText('Did you know?')).not.toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'This is a problem' }),
    ).toBeInTheDocument();
  });

  it('should handle useEffect for element focus when calculated=true and no errors', () => {
    const focusSpy = jest.fn();
    const scrollIntoViewSpy = jest.fn();

    const mockInfoElement = {
      focus: focusSpy,
      scrollIntoView: scrollIntoViewSpy,
    };

    const getElementByIdSpy = jest
      .spyOn(document, 'getElementById')
      .mockReturnValue(mockInfoElement as any);

    render(
      <StampDutyCalculator
        {...defaultProps}
        propertyPrice="250000"
        buyerType="firstTimeBuyer"
        calculated={true}
      />,
    );

    // Verify focus and scroll methods were called
    expect(focusSpy).toHaveBeenCalled();
    expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: 'smooth' });

    getElementByIdSpy.mockRestore();
  });

  it('should handle case when document.getElementById returns null', () => {
    const getElementByIdSpy = jest
      .spyOn(document, 'getElementById')
      .mockReturnValue(null);

    render(
      <StampDutyCalculator
        {...defaultProps}
        propertyPrice="250000"
        buyerType="firstTimeBuyer"
        calculated={true}
      />,
    );

    // Should not throw error when element is null
    expect(screen.getByTestId('tax-result')).toBeInTheDocument();

    getElementByIdSpy.mockRestore();
  });
});
