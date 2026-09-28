import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import { Tab } from '..';

describe('Tab component', () => {
  it('renders correctly', () => {
    const { container } = render(<Tab>Income</Tab>);
    expect(container).toMatchSnapshot();
  });
  it('renders active tab correctly', () => {
    const { container } = render(<Tab isActive>Income</Tab>);
    expect(container).toMatchSnapshot();
    expect(container.querySelector('.border-blue-700')).toBeInTheDocument();
  });
});
