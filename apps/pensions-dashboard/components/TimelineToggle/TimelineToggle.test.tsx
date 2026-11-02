import React from 'react';

import { useRouter } from 'next/router';

import { fireEvent, render, screen } from '@testing-library/react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { TimelineToggle } from './TimelineToggle';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@maps-react/hooks/useTranslation');

describe('TimelineToggle', () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/your-pensions-timeline',
      query: {},
      push: mockPush,
    });

    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
      locale: 'en',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders component with radios, correct labels and checked state', () => {
    render(<TimelineToggle selectedOption="legacy" />);

    const legacyRadio = screen.getByTestId(
      'timeline-toggle-option-legacy-radio',
    );
    const alternativeRadio = screen.getByTestId(
      'timeline-toggle-option-alternative-radio',
    );
    const legacyRadioLabel = screen.getByTestId(
      'timeline-toggle-option-legacy-label',
    );
    const alternativeRadioLabel = screen.getByTestId(
      'timeline-toggle-option-alternative-label',
    );

    expect(screen.getByTestId('timeline-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-toggle-intro')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-toggle-options')).toBeInTheDocument();

    expect(legacyRadio).toBeInTheDocument();
    expect(legacyRadio).toBeChecked();
    expect(legacyRadioLabel).toHaveTextContent(
      'components.timeline-toggle.legacy components.timeline-toggle.option',
    );

    expect(alternativeRadio).toBeInTheDocument();
    expect(alternativeRadio).not.toBeChecked();
    expect(alternativeRadioLabel).toHaveTextContent(
      'components.timeline-toggle.alternative components.timeline-toggle.option',
    );
  });

  it('updates selected state when clicking radio', () => {
    render(<TimelineToggle selectedOption="legacy" />);

    const alternativeRadio = screen.getByTestId(
      'timeline-toggle-option-alternative-radio',
    );
    fireEvent.click(alternativeRadio);
    expect(alternativeRadio).toBeChecked();
  });

  it('calls router.push with correct query when clicking a radio', () => {
    render(<TimelineToggle selectedOption="legacy" />);

    fireEvent.click(
      screen.getByTestId('timeline-toggle-option-alternative-radio'),
    );

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/your-pensions-timeline',
      query: { income: 'alternative' },
    });
  });
});
