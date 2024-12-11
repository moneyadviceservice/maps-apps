import { ReactNode, useMemo } from 'react';

import { twMerge } from 'tailwind-merge';

import NumberFormat from '../../components/NumberFormat';

export type Data = {
  name: ReactNode;
  percentage: number;
  colour: string;
};

type CommonPieChartProps = {
  items: Data[];
  title?: string;
  displayPercentage?: number; // item array index to display
};

type NumberDisplayProps = {
  value: number;
  direction: 'increase' | 'decrease';
};

export type PieChartProps = CommonPieChartProps &
  (NumberDisplayProps | object) &
  object;

const hasNumberDisplay = (
  props: PieChartProps,
): props is CommonPieChartProps & NumberDisplayProps =>
  'value' in props &&
  'direction' in props &&
  typeof props.value === 'number' &&
  typeof props.direction === 'string';

const PieChart = (props: PieChartProps) => {
  const { items, title, displayPercentage } = props;

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

  // @note after height and width being applied below should
  // also be added to the width increase/decrease container
  const afterWidthHeight = displayPercentage ? 65 : 55;
  const afterClasses = `after:absolute after:bg-white after:rounded-full after:top-2/4 after:left-2/4 after:-translate-y-2/4 after:-translate-x-2/4 ${
    displayPercentage
      ? 'after:h-[65%] after:w-[65%]'
      : 'after:h-[55%] after:w-[55%]'
  }`;

  const isIncreaseOrDecrease = hasNumberDisplay(props);

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
        {isIncreaseOrDecrease ? (
          <div
            className={`absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-center z-10 w-[${afterWidthHeight}%]`}
          >
            <div className="text-lg font-bold">
              <div className="text-gray-800">{title}</div>
              <NumberFormat direction={props.direction} value={props.value} />
            </div>
          </div>
        ) : null}
        {displayPercentage && (
          <div
            className={`absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-center z-10 w-[${afterWidthHeight}%]`}
          >
            <span className={`text-[32px]`}>
              {items[displayPercentage].percentage}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PieChart;
