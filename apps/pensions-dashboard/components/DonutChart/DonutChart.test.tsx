import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionType } from '../../lib/constants';
import { DonutChart, DonutChartProps } from './DonutChart';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

describe('BarCharts', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => {
        switch (key) {
          case 'pages.pension-details.details.latest-value':
            return 'Latest value';
          case 'pages.pension-details.details.estimate-at-retirement':
            return 'Estimate at retirement';
          case 'pages.pension-details.details.pot-value':
            return 'Pot value';
          case 'pages.pension-details.details.lump-sum':
            return 'Lump sum';
          case 'common.no-data':
            return 'No data';
          default:
            return key;
        }
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps: DonutChartProps = {
    ap: { date: '2023-01-01', amount: 10000 },
    eri: {
      date: '2030-01-01',
      amount: 15000,
    },
    pensionType: PensionType.DC,
    calcType: PensionType.DC,
  };

  it('renders the component elements', () => {
    render(<DonutChart {...defaultProps} />);
    expect(screen.getByTestId('donut-charts')).toBeInTheDocument();
    expect(screen.getByTestId('donut-heading')).toBeInTheDocument();
    expect(screen.getByTestId('donut-sr-content')).toBeInTheDocument();
  });

  it.each([
    [PensionType.AVC, PensionType.AVC, 'Pot value'],
    [PensionType.DC, PensionType.DC, 'Pot value'],
    [PensionType.DB, PensionType.DB, 'Lump sum'],
    [PensionType.HYB, PensionType.DC, 'Pot value'],
    [PensionType.HYB, PensionType.DB, 'Lump sum'],
  ])(
    'renders the correct pension type heading',
    (type, calcType, expectedText) => {
      render(
        <DonutChart {...defaultProps} pensionType={type} calcType={calcType} />,
      );
      const heading = screen.getByTestId('donut-heading');
      expect(heading).toHaveTextContent(expectedText);
    },
  );

  it('renders the screen reader only content correctly', () => {
    render(<DonutChart {...defaultProps} />);
    const srContent = screen.getByTestId('donut-sr-content');
    expect(srContent).toBeInTheDocument();
    expect(srContent.firstChild).toHaveTextContent(
      'Latest value (2023) : £10,000',
    );
    expect(srContent.lastChild).toHaveTextContent(
      'Estimate at retirement (2030) : £15,000',
    );
  });

  it.each([
    [0, 'Latest value2023'],
    [1, 'Estimate at retirement2030'],
  ])('renders correct legend label for index %i', (index, expectedText) => {
    render(<DonutChart {...defaultProps} />);
    expect(screen.getByTestId(`donut-legend-${index}`)).toHaveTextContent(
      expectedText,
    );
  });

  it.each([
    [PensionType.AVC, 0, 'fill-slate-350', 'stroke-slate-500', '1'],
    [PensionType.AVC, 1, 'fill-magenta-750', 'stroke-magenta-750', '0'],
    [PensionType.DC, 0, 'fill-slate-350', 'stroke-slate-500', '1'],
    [PensionType.DC, 1, 'fill-teal-700', 'stroke-teal-700', '0'],
    [PensionType.DB, 0, 'fill-slate-350', 'stroke-slate-500', '1'],
    [PensionType.DB, 1, 'fill-purple-650', 'stroke-purple-650', '0'],
    [PensionType.HYB, 0, 'fill-slate-350', 'stroke-slate-500', '1'],
    [PensionType.HYB, 1, 'fill-olive-500', 'stroke-olive-500', '0'],
  ])(
    'applies correct fill and stroke color for donut %i',
    (type, index, expectedFill, expectedStroke, expectedStrokeWidth) => {
      render(<DonutChart {...defaultProps} pensionType={type} />);
      const donutArc = screen.getByTestId(`donut-arc-${index}`);
      expect(donutArc).toHaveAttribute('stroke-width', expectedStrokeWidth);
      expect(donutArc).toHaveClass(expectedFill);
      expect(donutArc).toHaveClass(expectedStroke);
    },
  );

  it.each([
    [PensionType.AVC, 0, 'Latest value'],
    [PensionType.AVC, 1, 'Estimate at retirement'],
    [PensionType.DC, 0, 'Latest value'],
    [PensionType.DC, 1, 'Estimate at retirement'],
    [PensionType.DB, 0, 'Latest value'],
    [PensionType.DB, 1, 'Estimate at retirement'],
  ])('renders correctly when no data for donut %i', (type, index, legend) => {
    const noData: DonutChartProps = {
      ap: { date: undefined, amount: 0 },
      eri: { date: undefined, amount: 0 },
      pensionType: type,
      calcType: type,
    };
    render(<DonutChart {...noData} />);
    expect(screen.getByTestId(`donut-arc-${index}`)).toHaveAttribute(
      'stroke-width',
      '0',
    );
    expect(screen.getByTestId(`donut-outer-${index}`)).toHaveClass(
      'stroke-slate-500 fill-white',
    );
    expect(screen.getByTestId(`donut-legend-${index}`)).toHaveTextContent(
      legend,
    );
  });
});
