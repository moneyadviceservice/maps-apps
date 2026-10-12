import { ReactNode, useMemo } from 'react';

import { twMerge } from 'tailwind-merge';

import NumberFormat from '../NumberFormat';

export type Data = {
  name: ReactNode;
  percentage: number;
  colour: string;
};

type CommonPieChartProps = {
  items: Data[];
  title?: string;
  displayPercentage?: number; // item array index to display
  separatorWidth?: number;
  showGaps?: boolean;
};

type NumberDisplayProps = {
  value: number;
  direction: 'increase' | 'decrease';
};

export type PieChartProps = CommonPieChartProps & (NumberDisplayProps | object);

const hasNumberDisplay = (
  props: PieChartProps,
): props is CommonPieChartProps & NumberDisplayProps =>
  'value' in props &&
  'direction' in props &&
  typeof props.value === 'number' &&
  typeof props.direction === 'string';

const PieChart = (props: PieChartProps) => {
  const {
    items,
    title,
    displayPercentage,
    separatorWidth = 2,
    showGaps = false,
  } = props;

  const colourPercentCSSValue = useMemo(() => {
    let percentage = 0;
    return items
      .map((type, index) => {
        percentage += type.percentage;

        return `${type.colour} ${
          index === 0 ? 0 + '%' : percentage - type.percentage + '%'
        } ${percentage}%`;
      })
      .join(', ');
  }, [items]);

  const isIncreaseOrDecrease = hasNumberDisplay(props);
  const hasDisplayPercentage = displayPercentage !== undefined;

  const separators = useMemo(() => {
    if (!showGaps || items.length < 2) {
      return [];
    }

    const center = 50;
    const outerRadius = 50;
    const innerRadius = 50 * 0.55;
    // Calculate the angle at the start of each segment (including 0deg)
    const boundaries = [0];
    let cumulativeAngle = 0;
    for (let i = 0; i < items.length - 1; i++) {
      cumulativeAngle += items[i].percentage * 3.6;
      boundaries.push(cumulativeAngle);
    }

    return boundaries.map((angle) => {
      const rad = ((angle - 90) * Math.PI) / 180;
      const inner = {
        x: center + innerRadius * Math.cos(rad),
        y: center + innerRadius * Math.sin(rad),
      };
      const outer = {
        x: center + outerRadius * Math.cos(rad),
        y: center + outerRadius * Math.sin(rad),
      };
      return {
        x1: inner.x,
        y1: inner.y,
        x2: outer.x,
        y2: outer.y,
      };
    });
  }, [items, showGaps]);

  // @note after height and width being applied below should
  // also be added to the width increase/decrease container
  const afterWidthHeight = hasDisplayPercentage ? 65 : 55;

  const afterClasses = `after:absolute after:bg-white after:rounded-full after:top-2/4 after:left-2/4 after:-translate-y-2/4 after:-translate-x-2/4 ${
    hasDisplayPercentage
      ? 'after:h-[65%] after:w-[65%]'
      : 'after:h-[55%] after:w-[55%]'
  }`;

  return (
    <div className="h-0 pt-[100%] overflow-hidden relative flex-none my-10 w-full">
      <div
        className={twMerge(
          afterClasses,
          'rounded-full w-full h-full absolute left-0 right-0 top-0 bottom-0',
        )}
        style={{
          background: `conic-gradient(${colourPercentCSSValue})`,
        }}
      >
        {/* Optional SVG overlay used to draw white separator lines between pie segments */}
        {showGaps && separators.length > 0 && (
          <svg
            viewBox="0 0 100 100"
            className="absolute top-0 bottom-0 left-0 right-0 w-full h-full"
            aria-hidden="true"
          >
            {separators.map((line, index) => (
              <line
                key={index}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="white"
                strokeWidth={separatorWidth}
                strokeLinecap="round"
              />
            ))}
          </svg>
        )}

        {/* CENTER CONTENT */}
        {(isIncreaseOrDecrease || hasDisplayPercentage) && (
          <div
            className={`absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-center z-10 w-[${afterWidthHeight}%]`}
          >
            <div className="text-lg font-bold">
              {title && <div className="text-gray-800">{title}</div>}

              {isIncreaseOrDecrease ? (
                <NumberFormat direction={props.direction} value={props.value} />
              ) : (
                <span className="text-[32px] font-normal">
                  {hasDisplayPercentage
                    ? items[displayPercentage]?.percentage ?? 0
                    : 0}
                  %
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PieChart;
