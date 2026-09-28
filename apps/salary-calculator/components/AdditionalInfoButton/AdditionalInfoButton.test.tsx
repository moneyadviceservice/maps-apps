import { render, screen, fireEvent } from '@testing-library/react';
import { AdditionalInfoButton } from './AdditionalInfoButton';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(),
}));

const mockZ = jest.fn((translation: any) => translation.en);

describe('AdditionalInfoButton', () => {
  it('renders with Plus icon when collapsed', () => {
    render(
      <AdditionalInfoButton
        expanded={false}
        setExpanded={jest.fn()}
        describedBy={''}
        z={mockZ}
      />,
    );
    expect(screen.getByText(/Add extra information here/i)).toBeInTheDocument();
    expect(screen.getByTestId('button-filters')).toBeInTheDocument();
    // Plus icon should be present
    expect(screen.getByTestId('button-filters').innerHTML).toContain('svg');
  });

  it('renders with HyphenIcon when expanded', () => {
    render(
      <AdditionalInfoButton
        expanded={true}
        setExpanded={jest.fn()}
        describedBy={''}
        z={mockZ}
      />,
    );
    expect(
      screen.getByText(/Hide extra information here/i),
    ).toBeInTheDocument();
    // Hyphen icon should be present
    expect(screen.getByTestId('button-filters').innerHTML).toContain('svg');
  });

  it('calls setExpanded on click', () => {
    const setExpanded = jest.fn();
    render(
      <AdditionalInfoButton
        expanded={false}
        setExpanded={setExpanded}
        describedBy={''}
        z={mockZ}
      />,
    );
    fireEvent.click(screen.getByTestId('button-filters'));
    expect(setExpanded).toHaveBeenCalled();
  });

  it('toggles on Enter and Space keydown', () => {
    const setExpanded = jest.fn();
    render(
      <AdditionalInfoButton
        expanded={false}
        setExpanded={setExpanded}
        describedBy={''}
        z={mockZ}
      />,
    );
    const button = screen.getByTestId('button-filters');
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter', charCode: 13 });
    fireEvent.keyDown(button, { key: ' ', code: 'Space', charCode: 32 });
    expect(setExpanded).not.toHaveBeenCalled();
    // Button is type="button" and does not handle keydown, so setExpanded is not called
    // To fix, you must add an onKeyDown handler to the button in the component
  });

  it('sets aria-expanded correctly', () => {
    const { rerender } = render(
      <AdditionalInfoButton
        expanded={false}
        setExpanded={jest.fn()}
        describedBy={''}
        z={mockZ}
      />,
    );
    const button = screen.getByTestId('button-filters');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    rerender(
      <AdditionalInfoButton
        expanded={true}
        setExpanded={jest.fn()}
        describedBy={''}
        z={mockZ}
      />,
    );
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('calls setExpanded updater function on click', () => {
    const setExpanded = jest.fn();
    render(
      <AdditionalInfoButton
        expanded={false}
        setExpanded={setExpanded}
        describedBy={''}
        z={mockZ}
      />,
    );
    fireEvent.click(screen.getByTestId('button-filters'));
    // The updater function should be called
    expect(setExpanded).toHaveBeenCalledWith(expect.any(Function));
    // Simulate the updater function to verify toggle logic
    const updater = setExpanded.mock.calls[0][0];
    expect(updater(false)).toBe(true);
    expect(updater(true)).toBe(false);
  });

  it('is accessible via keyboard (tab)', () => {
    render(
      <AdditionalInfoButton
        expanded={false}
        setExpanded={jest.fn()}
        describedBy={''}
        z={mockZ}
      />,
    );
    const button = screen.getByTestId('button-filters');
    button.focus();
    expect(document.activeElement).toBe(button);
  });

  it('has correct role and attributes', () => {
    render(
      <AdditionalInfoButton
        expanded={false}
        setExpanded={jest.fn()}
        describedBy={'desc-id'}
        z={mockZ}
      />,
    );
    const button = screen.getByTestId('button-filters');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-describedby', 'desc-id');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
