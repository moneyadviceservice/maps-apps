import { render, screen } from '@testing-library/react';

import { useFocusOnMount } from './useFocusOnMount';

import '@testing-library/jest-dom';

const Focusable = ({ label }: { label: string }) => {
  const ref = useFocusOnMount<HTMLDivElement>();

  return (
    <div ref={ref} tabIndex={-1}>
      {label}
    </div>
  );
};

describe('useFocusOnMount', () => {
  Element.prototype.scrollIntoView = jest.fn();

  it('focuses and scrolls to the element on mount', () => {
    render(<Focusable label="first" />);

    expect(screen.getByText('first')).toHaveFocus();
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it('leaves focus with the first element to take it', () => {
    render(
      <>
        <Focusable label="first" />
        <Focusable label="second" />
      </>,
    );

    expect(screen.getByText('first')).toHaveFocus();
  });
});
