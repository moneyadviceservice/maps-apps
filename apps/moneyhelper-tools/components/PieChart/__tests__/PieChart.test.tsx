import { render } from '@testing-library/react';
import PieChart from '..';

const data = [
  {
    name: 'Household bills',
    percentage: 50,
    colour: '#007a91',
  },
  {
    name: 'Living costs',
    percentage: 20,
    colour: '#f56727',
  },
  {
    name: 'Finance & Insurance',
    percentage: 15,
    colour: '#bc0061',
  },
  {
    name: 'Family & Friends',
    percentage: 5,
    colour: '#879a24',
  },
  {
    name: 'Travel',
    percentage: 5,
    colour: '#000d3d',
  },
  {
    name: 'Leisure',
    percentage: 5,
    colour: '#0b4a6d',
  },
];

describe('PieChart component', () => {
  it('renders correctly', () => {
    const { container } = render(<PieChart items={data} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
