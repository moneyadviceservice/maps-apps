import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import { FrequencySelector } from './FrequencySelector';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: (obj: { en: string; cy: string }) => obj.en,
  }),
}));

jest.mock('@maps-react/hooks/useLanguage', () => ({
  useLanguage: () => 'en',
}));

jest.mock('@maps-react/common/components/Button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock('@maps-react/form/components/Select', () => ({
  Select: ({ options, formData = {}, ...props }: any) => (
    <>
      <select data-testid="select" {...props}>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.text}
          </option>
        ))}
      </select>
      {Object.entries(formData)
        .filter(([key]) => key !== 'resultsFrequency')
        .map(([key, value]) => (
          <input
            key={key}
            type="hidden"
            name={key}
            value={String(value)}
            data-testid={`hidden-${key}`}
          />
        ))}
    </>
  ),
}));

describe('FrequencySelector', () => {
  test('renders JS version after useEffect runs', async () => {
    render(
      <FrequencySelector
        currentFrequency="monthly"
        onFrequencyChange={jest.fn()}
      />,
    );

    // Wait for isJsEnabled to switch to true
    await waitFor(() => {
      expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('form')).not.toBeInTheDocument();
  });

  test('calls onFrequencyChange when JS select changes', async () => {
    const mockFn = jest.fn();

    render(
      <FrequencySelector
        currentFrequency="monthly"
        onFrequencyChange={mockFn}
      />,
    );

    await waitFor(() => screen.getByTestId('select'));

    fireEvent.change(screen.getByTestId('select'), {
      target: { value: 'weekly' },
    });

    expect(mockFn).toHaveBeenCalledWith('weekly');
  });

  test('renders non-JS version BEFORE useEffect runs', () => {
    // This tests the initial render only
    jest.spyOn(React, 'useEffect').mockImplementation(() => {});

    render(
      <FrequencySelector
        currentFrequency="yearly"
        onFrequencyChange={jest.fn()}
      />,
    );

    expect(screen.getByTestId('select')).toBeInTheDocument();
    // The "Update" button is not rendered in the current non-JS markup
  });

  test('non-JS select is rendered', () => {
    jest.spyOn(React, 'useEffect').mockImplementation(() => {});

    render(
      <FrequencySelector
        currentFrequency="weekly"
        onFrequencyChange={jest.fn()}
      />,
    );

    expect(screen.getByTestId('select')).toBeInTheDocument();
  });

  test('renders all frequency options', async () => {
    render(
      <FrequencySelector
        currentFrequency="yearly"
        onFrequencyChange={jest.fn()}
      />,
    );

    await waitFor(() => screen.getByText('Annually'));

    expect(screen.getByText('Annually')).toBeInTheDocument();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('Weekly')).toBeInTheDocument();
    expect(screen.getByText('Daily')).toBeInTheDocument();
  });
});
