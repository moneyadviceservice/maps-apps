import '@testing-library/jest-dom';
import { fireEvent, getByText, render } from '@testing-library/react';
import { ErrorSummary } from './ErrorSummary';

const errors = {
  test1: ['test1', ' - ', 'test1'],
};

window.HTMLElement.prototype.getBoundingClientRect = () =>
  ({
    top: 20,
  } as DOMRect);

window.HTMLElement.prototype.scrollIntoView = jest.fn();
jest.spyOn(window, 'scroll').mockImplementation(() => {});

describe('ErrorSummary component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <>
        <ErrorSummary title={''} errors={errors} />
        <input id="test1" name="test1" type="text" />
      </>,
    );

    fireEvent(
      getByText(container, 'test1 - test1', { exact: false }),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(container).toMatchSnapshot();
  });
});
