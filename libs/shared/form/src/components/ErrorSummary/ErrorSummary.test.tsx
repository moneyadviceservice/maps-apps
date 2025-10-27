import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import {
  ErrorSummary,
  getErrorKeysWithMessages,
  scrollElementIntoView,
} from './ErrorSummary';

import '@testing-library/jest-dom';

const title = 'Error Summary';
const errors = {
  error1: ['Error message 1'],
  error2: ['Error message 2'],
};

describe('ErrorSummary', () => {
  it('renders component', () => {
    const { container } = render(
      <ErrorSummary title={title} errors={errors} />,
    );

    expect(screen.getByRole('heading')).toHaveTextContent(title);

    expect(screen.getByText('Error message 1')).toBeInTheDocument();
    expect(screen.getByText('Error message 2')).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it('render child components if provided', () => {
    const { container } = render(
      <ErrorSummary title={title} errors={errors}>
        <p>Child component</p>
      </ErrorSummary>,
    );

    expect(screen.getByRole('heading')).toHaveTextContent(title);

    expect(screen.getByText('Child component')).toBeInTheDocument();

    expect(screen.getByText('Error message 1')).toBeInTheDocument();
    expect(screen.getByText('Error message 2')).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it('returns null if errors is undefined or has no valid messages', () => {
    // errors is undefined
    const { container: container1 } = render(
      <ErrorSummary title="Test" errors={undefined} />,
    );
    expect(container1.firstChild).toBeNull();

    // errors has no valid messages
    const { container: container2 } = render(
      <ErrorSummary title="Test" errors={{ name: [''], age: [] }} />,
    );
    expect(container2.firstChild).toBeNull();
  });

  it('renders without pl-6 class when only one error message', () => {
    const { getByTestId } = render(
      <ErrorSummary title={title} errors={{ error1: ['Only one error'] }} />,
    );

    expect(getByTestId('error-records')).not.toHaveClass('pl-6');
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

describe('scrollElementIntoView', () => {
  it('calls scrollIntoView on the element', () => {
    const mockElement = {
      scrollIntoView: jest.fn(),
    } as unknown as HTMLElement;

    scrollElementIntoView(mockElement);

    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  });

  it('does nothing if element is null or undefined', () => {
    expect(() => scrollElementIntoView(null)).not.toThrow();
    expect(() => scrollElementIntoView(undefined)).not.toThrow();
  });
});

describe('getErrorKeysWithMessages', () => {
  it('returns keys with at least one non-empty string message', () => {
    const errors = {
      name: ['Required', ''],
      email: [''],
      age: ['Must be a number', ' '],
      address: [],
    };
    expect(getErrorKeysWithMessages(errors)).toEqual(['name', 'age']);
  });

  it('returns an empty array if errors is undefined', () => {
    expect(getErrorKeysWithMessages(undefined)).toEqual([]);
  });

  it('returns an empty array if no keys have valid messages', () => {
    const errors = {
      name: [' ', ''],
      email: [],
    };
    expect(getErrorKeysWithMessages(errors)).toEqual([]);
  });

  it('handles empty object', () => {
    expect(getErrorKeysWithMessages({})).toEqual([]);
  });
});
