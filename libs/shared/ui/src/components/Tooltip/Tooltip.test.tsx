import { fireEvent, render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { Tooltip } from './Tooltip';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Tooltip', () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      z: ({ en, cy }: { en: string; cy?: string }) => cy ?? en,
    });
  });

  beforeAll(() => {
    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 100,
      height: 30,
      top: 0,
      left: 0,
      right: 100,
      bottom: 30,
      x: 0,
      y: 0,
      toJSON: () => {
        return JSON.stringify({
          width: 100,
          height: 30,
          top: 0,
          left: 0,
          right: 100,
          bottom: 30,
          x: 0,
          y: 0,
        });
      },
    }));

    // Mock window innerWidth
    Object.defineProperty(window, 'innerWidth', { value: 1024 });

    // Mock requestAnimationFrame
    global.requestAnimationFrame = (cb) => {
      cb(0); // Pass 0 as the timestamp parameter
      return 0;
    };
  });

  it('renders with default props', () => {
    render(
      <Tooltip>
        <p>Tooltip content</p>
      </Tooltip>,
    );

    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    // the following attributes need to be present to ensure this works for JS disabled users
    expect(screen.getByTestId('tooltip-input')).toHaveAttribute('id');
    expect(screen.getByTestId('tooltip-icon')).toHaveAttribute('for');
  });

  it('renders with custom testId', () => {
    render(
      <Tooltip testId="custom-tooltip">
        <p>Tooltip content</p>
      </Tooltip>,
    );

    expect(screen.getByTestId('custom-tooltip')).toBeInTheDocument();
  });

  it('toggles tooltip visibility on click', () => {
    render(
      <Tooltip>
        <p>Tooltip content</p>
      </Tooltip>,
    );

    const tooltipIcon = screen.getByTestId('tooltip-icon');

    // Initially tooltip is hidden
    expect(screen.getByTestId('tooltip-input')).not.toBeChecked();

    // Click to open tooltip
    fireEvent.click(tooltipIcon);
    expect(screen.getByTestId('tooltip-input')).toBeChecked();

    // Click again to close
    fireEvent.click(tooltipIcon);
    expect(screen.getByTestId('tooltip-input')).not.toBeChecked();
  });

  it('handles keyboard navigation', () => {
    render(
      <Tooltip>
        <p>Tooltip content</p>
      </Tooltip>,
    );

    const tooltipIcon = screen.getByTestId('tooltip-icon');

    // Initially tooltip is hidden
    expect(screen.getByTestId('tooltip-input')).not.toBeChecked();

    // Press Enter to open tooltip
    fireEvent.keyDown(tooltipIcon, { key: 'Enter' });
    expect(screen.getByTestId('tooltip-input')).toBeChecked();

    // Press Space to close tooltip
    fireEvent.keyDown(tooltipIcon, { key: ' ' });
    expect(screen.getByTestId('tooltip-input')).not.toBeChecked();
  });

  it('close button hides tooltip', () => {
    render(
      <Tooltip>
        <p>Tooltip content</p>
      </Tooltip>,
    );

    const tooltipIcon = screen.getByTestId('tooltip-icon');

    // Open tooltip
    fireEvent.click(tooltipIcon);

    // Find and click close button
    const closeButton = screen.getByTestId('tooltip-close');
    fireEvent.click(closeButton);

    // Tooltip should be hidden
    expect(screen.getByTestId('tooltip-input')).not.toBeChecked();
  });

  it('renders with custom accessibility labels', () => {
    render(
      <Tooltip
        accessibilityLabelOpen="Custom info"
        buttonCloseText="Custom close"
      >
        <p>Tooltip content</p>
      </Tooltip>,
    );

    expect(screen.getByText('Custom info')).toBeInTheDocument();

    // Open tooltip to see close button
    const tooltipIcon = screen.getByTestId('tooltip-icon');
    fireEvent.click(tooltipIcon);

    expect(screen.getByText('Custom close')).toBeInTheDocument();
  });

  it('applies custom content classes', () => {
    render(
      <Tooltip contentClasses="custom-class">
        <p>Tooltip content</p>
      </Tooltip>,
    );

    const tooltipIcon = screen.getByTestId('tooltip');
    fireEvent.click(tooltipIcon);

    const tooltipContent = screen.getByTestId('tooltip-content');
    expect(tooltipContent).toHaveClass('custom-class');
  });

  it('repositions tooltip when centerArrow is true', () => {
    const setPropertySpy = jest.spyOn(
      CSSStyleDeclaration.prototype,
      'setProperty',
    );

    render(
      <Tooltip centerArrow>
        <p>Tooltip content</p>
      </Tooltip>,
    );

    const tooltipIcon = screen.getByTestId('tooltip-icon');
    fireEvent.click(tooltipIcon);

    expect(setPropertySpy).toHaveBeenCalledWith(
      '--arrow-left',
      expect.any(String),
    );
  });

  it('resets styles when tooltip is opened without centerArrow', () => {
    const setPropertySpy = jest.spyOn(
      CSSStyleDeclaration.prototype,
      'setProperty',
    );

    render(
      <Tooltip centerArrow={false}>
        <p>Tooltip content</p>
      </Tooltip>,
    );

    const tooltipIcon = screen.getByTestId('tooltip-icon');
    fireEvent.click(tooltipIcon);

    expect(setPropertySpy).toHaveBeenCalledWith('--arrow-left', '6.6rem');
  });

  it('repositions tooltip when it would overflow viewport', () => {
    // Mock smaller window width to force repositioning
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      value: 300,
      configurable: true,
    });

    const setPropertySpy = jest.spyOn(
      CSSStyleDeclaration.prototype,
      'setProperty',
    );

    render(
      <Tooltip>
        <p>Tooltip content</p>
      </Tooltip>,
    );

    const tooltipIcon = screen.getByTestId('tooltip-icon');
    fireEvent.click(tooltipIcon);

    expect(setPropertySpy).toHaveBeenCalled();

    // Restore original window width
    Object.defineProperty(window, 'innerWidth', {
      value: originalInnerWidth,
      configurable: true,
    });
  });

  it('responds to window resize events when tooltip is open', () => {
    const repositionSpy = jest.spyOn(
      Element.prototype,
      'getBoundingClientRect',
    );

    render(
      <Tooltip>
        <p>Tooltip content</p>
      </Tooltip>,
    );

    const tooltipIcon = screen.getByTestId('tooltip-icon');
    fireEvent.click(tooltipIcon);

    // Clear previous calls to getBoundingClientRect
    repositionSpy.mockClear();

    // Trigger resize event
    fireEvent(window, new Event('resize'));

    expect(repositionSpy).toHaveBeenCalled();
  });

  it('sets aria-haspopup and updates aria-expanded on the trigger', () => {
    render(
      <Tooltip>
        <p>Tooltip content</p>
      </Tooltip>,
    );

    const tooltipIcon = screen.getByTestId('tooltip-icon');

    expect(tooltipIcon).toHaveAttribute('aria-haspopup', 'dialog');
    expect(tooltipIcon).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(tooltipIcon);
    expect(tooltipIcon).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes all open tooltips when Escape is pressed', () => {
    render(
      <>
        <Tooltip testId="tooltip-one">
          <p>Tooltip one content</p>
        </Tooltip>
        <Tooltip testId="tooltip-two">
          <p>Tooltip two content</p>
        </Tooltip>
      </>,
    );

    fireEvent.click(screen.getByTestId('tooltip-one-icon'));
    fireEvent.click(screen.getByTestId('tooltip-two-icon'));

    expect(screen.getByTestId('tooltip-one-input')).toBeChecked();
    expect(screen.getByTestId('tooltip-two-input')).toBeChecked();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.getByTestId('tooltip-one-input')).not.toBeChecked();
    expect(screen.getByTestId('tooltip-two-input')).not.toBeChecked();
  });

  it('closes tooltip when clicking outside of its container', () => {
    render(
      <>
        <Tooltip testId="tooltip-one">
          <p>Tooltip one content</p>
        </Tooltip>
        <button data-testid="outside-button" type="button">
          Outside
        </button>
      </>,
    );

    fireEvent.click(screen.getByTestId('tooltip-one-icon'));
    expect(screen.getByTestId('tooltip-one-input')).toBeChecked();

    fireEvent.mouseDown(screen.getByTestId('outside-button'));

    expect(screen.getByTestId('tooltip-one-input')).not.toBeChecked();
  });

  it('closes previous tooltip when opening another tooltip', () => {
    render(
      <>
        <Tooltip testId="tooltip-one">
          <p>Tooltip one content</p>
        </Tooltip>
        <Tooltip testId="tooltip-two">
          <p>Tooltip two content</p>
        </Tooltip>
      </>,
    );

    fireEvent.click(screen.getByTestId('tooltip-one-icon'));
    expect(screen.getByTestId('tooltip-one-input')).toBeChecked();

    fireEvent.mouseDown(screen.getByTestId('tooltip-two-icon'));
    fireEvent.click(screen.getByTestId('tooltip-two-icon'));

    expect(screen.getByTestId('tooltip-one-input')).not.toBeChecked();
    expect(screen.getByTestId('tooltip-two-input')).toBeChecked();
  });
});
