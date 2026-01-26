import NumberFormat from '@maps-react/common/components/NumberFormat';
import { render } from '@testing-library/react';
import {
  background,
  items,
  itemsDecrease,
  itemsIncrease,
  itemsNegative,
  itemsNeutral,
  itemsWithEstimate,
} from './mocks';
import SummaryTotal from './SummaryTotal';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('SummaryTotal component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <SummaryTotal
        items={items}
        summary={{
          label: 'Spare cash',
          value: (
            <NumberFormat
              prefix="£"
              renderText={(value) => <b>{value}</b>}
              value={800}
            />
          ),
          background,
        }}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders with children', () => {
    const { container } = render(
      <SummaryTotal
        items={items}
        summary={{
          label: 'Spare cash',
          value: (
            <NumberFormat
              prefix="£"
              renderText={(value) => <b>{value}</b>}
              value={800}
            />
          ),
          background,
        }}
      >
        <button>Reset the calculator</button>
      </SummaryTotal>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders with dropdown', () => {
    const { container } = render(
      <SummaryTotal
        items={items}
        summary={{
          label: 'Spare cash',
          value: (
            <NumberFormat
              prefix="£"
              renderText={(value) => <b>{value}</b>}
              value={800}
            />
          ),
          background,
        }}
        selectOptions={[
          { value: '1', text: 'Per month' },
          { value: '12', text: 'Per year' },
        ]}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders neutral', () => {
    const { container } = render(
      <SummaryTotal
        items={itemsNeutral}
        summary={{
          label: 'Zero balance',
          value: (
            <NumberFormat
              prefix="£"
              renderText={(value) => <b>{value}</b>}
              value={0}
            />
          ),
          background: 'bg-gray-400',
        }}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders negative', () => {
    const { container } = render(
      <SummaryTotal
        items={itemsNegative}
        summary={{
          label: 'Overspend',
          value: (
            <NumberFormat
              prefix="£"
              renderText={(value) => <b>{value}</b>}
              value={200}
            />
          ),
          background: 'bg-red-600',
        }}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders with increase', () => {
    const { container } = render(
      <SummaryTotal
        items={itemsIncrease}
        summary={{
          label: 'Spare cash',
          value: (
            <NumberFormat
              prefix="£"
              renderText={(value) => <b>{value}</b>}
              value={800}
            />
          ),
          background,
        }}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders with decrease', () => {
    const { container } = render(
      <SummaryTotal
        items={itemsDecrease}
        summary={{
          label: 'Spare cash',
          value: (
            <NumberFormat
              prefix="£"
              renderText={(value) => <b>{value}</b>}
              value={800}
            />
          ),
          background,
        }}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders with Estimate', () => {
    const { container } = render(
      <SummaryTotal
        items={itemsWithEstimate}
        summary={{
          isEstimate: true,
          label: 'Estimated Spare Cash',
          value: (
            <NumberFormat
              prefix="£"
              renderText={(value) => <b>{value}</b>}
              value={800}
            />
          ),
          background,
        }}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
