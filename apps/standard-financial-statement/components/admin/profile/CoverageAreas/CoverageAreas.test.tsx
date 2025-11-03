import { render } from '@testing-library/react';

import { Organisation } from '../../../../types/Organisations';
import { baseMockData } from '../__tests__mocks/mock-data';
import { CoverageAreas } from './CoverageAreas';

import '@testing-library/jest-dom';

jest.mock('../../../formInputs/CheckboxGroup', () => ({
  CheckboxGroup: (props: {
    defaultValues: {
      key: string;
      title: string;
    }[];
  }) => (
    <div data-testid="checkbox-group">
      Mocked CheckboxGroup - default keys:{' '}
      {props.defaultValues
        .map((v: { key: string; title: string }) => v.key)
        .join(', ')}
    </div>
  ),
}));

const mockData: Partial<Organisation> = {
  geo_regions: [
    { key: 'wales', title: 'Wales' },
    { key: 'scotland', title: 'Scotland' },
  ],
};

describe('CoverageAreas', () => {
  describe('component in read mode', () => {
    it('renders all region titles with tick icons', () => {
      const mockData: Organisation = {
        ...baseMockData,
        geo_regions: [
          { key: '', title: 'London' },
          { key: '', title: 'Manchester' },
          { key: '', title: 'Bristol' },
        ],
      };

      const { getByText, getAllByTestId } = render(
        <CoverageAreas data={mockData} />,
      );

      const regions = getAllByTestId('coverage-item');
      expect(regions).toHaveLength(3);
      expect(getByText('London')).toBeInTheDocument();
      expect(getByText('Manchester')).toBeInTheDocument();
      expect(getByText('Bristol')).toBeInTheDocument();
    });

    it('renders "N/A" if there are no geo regions', () => {
      const { getByTestId } = render(<CoverageAreas data={baseMockData} />);

      expect(getByTestId('coverage-na')).toBeInTheDocument();
      expect(getByTestId('coverage-na')).toHaveTextContent('N/A');
    });

    it('matches snapshot', () => {
      const mockData: Organisation = {
        ...baseMockData,
        geo_regions: [{ key: '', title: 'Scotland' }],
      };

      const { container } = render(<CoverageAreas data={mockData} />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('CoverageAreas component in edit mode', () => {
    it('renders default regions', () => {
      const { container, getByTestId } = render(
        <CoverageAreas
          data={mockData as unknown as Organisation}
          isEditMode={true}
        />,
      );

      const checkboxGroup = getByTestId('checkbox-group');
      expect(checkboxGroup).toHaveTextContent('Mocked CheckboxGroup');
      expect(checkboxGroup).toHaveTextContent('wales');
      expect(checkboxGroup).toHaveTextContent('scotland');

      expect(container).toMatchSnapshot();
    });

    it('does not render static tick/label display', () => {
      const { queryAllByTestId, queryByTestId } = render(
        <CoverageAreas
          data={mockData as unknown as Organisation}
          isEditMode={true}
        />,
      );

      const items = queryAllByTestId('coverage-item');
      expect(items.length).toBe(0);

      const naFallback = queryByTestId('coverage-na');
      expect(naFallback).not.toBeInTheDocument();
    });
  });
});
