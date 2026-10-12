import { fireEvent, render, screen } from '@testing-library/react';

import FocusLink, { Action, unfocusElement } from './FocusLink';

describe('FocusLink component', () => {
  let focusElement: HTMLElement;

  beforeEach(() => {
    focusElement = document.createElement('div');
    focusElement.setAttribute('id', 'focus-element');
    document.body.appendChild(focusElement);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should scroll to the top and focus the element when clicked (Action.TopOfPage)', () => {
    const scrollToMock = jest.spyOn(window, 'scrollTo');
    const focusMock = jest.spyOn(focusElement, 'focus');

    render(
      <FocusLink focusID="focus-element" action={Action.TopOfPage}>
        Focus
      </FocusLink>,
    );

    const focusLink = screen.getByText('Focus');
    fireEvent.click(focusLink);

    expect(scrollToMock).toHaveBeenCalledWith(0, 0);
    expect(focusMock).toHaveBeenCalled();

    scrollToMock.mockRestore();
    focusMock.mockRestore();
  });

  it('should scroll to the top when Action.TopOfPage is clicked', () => {
    const scrollToMock = jest.fn();
    window.scrollTo = scrollToMock;

    render(
      <FocusLink
        focusID="focus-element"
        action={Action.TopOfPage}
        className="custom-class"
      >
        Focus
      </FocusLink>,
    );

    const button = screen.getByText('Focus');
    fireEvent.click(button);

    expect(scrollToMock).toHaveBeenCalledWith(0, 0);
  });

  it('should call unfocusElement when handleBlur is triggered', () => {
    const handleBlur = (event: Event) => {
      event.preventDefault();

      if (focusElement) {
        unfocusElement(focusElement);
      }
    };

    focusElement.addEventListener('blur', handleBlur);

    fireEvent.blur(focusElement);

    expect(focusElement.hasAttribute('tabIndex')).toBe(false);
  });

  it('should remove the tabIndex attribute if it exists', () => {
    focusElement.setAttribute('tabIndex', '0');
    document.body.appendChild(focusElement);

    unfocusElement(focusElement);

    expect(focusElement.hasAttribute('tabIndex')).toBe(false);
  });

  it('should not affect the element if the tabIndex attribute does not exist', () => {
    document.body.appendChild(focusElement);

    unfocusElement(focusElement);

    expect(focusElement.hasAttribute('tabIndex')).toBe(false);
  });
});
