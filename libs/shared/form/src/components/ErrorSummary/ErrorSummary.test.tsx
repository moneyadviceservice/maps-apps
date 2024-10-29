import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorSummary } from './ErrorSummary';

const title = 'Error Summary';
const errors = {
  error1: ['Error message 1'],
  error2: ['Error message 2'],
};

describe('ErrorSummary', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ErrorSummary title={title} errors={errors} />,
    );

    expect(screen.getByRole('heading')).toHaveTextContent(title);

    expect(screen.getByText('Error message 1')).toBeInTheDocument();
    expect(screen.getByText('Error message 2')).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it('adds custom classNames when provided', () => {
    const customClass = 'custom-class';
    const { getByTestId } = render(
      <ErrorSummary title={title} errors={errors} classNames={customClass} />,
    );

    expect(getByTestId('error-records')).toHaveClass(customClass);
  });

  it('forwards ref with focus and scrollIntoView functions', () => {
    const ref = React.createRef<HTMLDivElement>();
    const { getByTestId } = render(
      <ErrorSummary ref={ref} title={title} errors={errors} />,
    );

    act(() => {
      ref.current?.focus();
    });

    expect(getByTestId('error-summary-container')).toBe(document.activeElement);

    if (ref.current) {
      const scrollSpy = jest
        .spyOn(ref.current, 'scrollIntoView')
        .mockImplementation(() => {
          jest.fn();
        });
      act(() => {
        ref.current?.scrollIntoView();
      });
      expect(scrollSpy).toHaveBeenCalled();
      scrollSpy.mockRestore();
    } else {
      throw new Error('ref.current is null');
    }
  });

  it('handles link clicks correctly with jsEnabled true', () => {
    window.scroll = jest.fn();

    const mockGrandparent = document.createElement('div');
    mockGrandparent.id = 'grandparent';
    mockGrandparent.getBoundingClientRect = jest
      .fn()
      .mockReturnValue({ top: 100 });

    const mockParent = document.createElement('div');

    const mockElement = document.createElement('div');
    mockElement.id = 'test-error1';
    mockElement.tabIndex = -1;
    mockElement.textContent = 'This is a mock error element';
    mockElement.getBoundingClientRect = jest.fn().mockReturnValue({ top: 100 });

    mockParent.appendChild(mockElement);
    mockGrandparent.appendChild(mockParent);
    document.body.appendChild(mockGrandparent);

    jest.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'test-error1') {
        return mockElement;
      }
      return null;
    });

    const { getByTestId } = render(
      <ErrorSummary title={title} errors={errors} errorKeyPrefix="test-" />,
    );

    const link = getByTestId('error-link-0');

    act(() => {
      fireEvent.click(link);
    });

    expect(mockElement).toHaveFocus();
  });
});
