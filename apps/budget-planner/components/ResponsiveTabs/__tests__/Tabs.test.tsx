import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import Tabs, { Tab } from '..';

const scrollIntoViewMock = jest.fn();

Object.defineProperty(window.Element.prototype, 'scrollIntoView', {
  writable: true,
  value: scrollIntoViewMock,
});

describe('Tabs component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <Tabs>
        <Tab>Income</Tab>
        <Tab isActive>Bills</Tab>
        <Tab>Family</Tab>
        <Tab>Travel</Tab>
      </Tabs>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
