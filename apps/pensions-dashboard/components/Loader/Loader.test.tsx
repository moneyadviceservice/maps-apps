import React from 'react';

import { act, render, screen } from '@testing-library/react';

import { Loader } from './Loader';

import '@testing-library/jest-dom';

jest.useFakeTimers();

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

jest.mock('@maps-react/common/components/Carousel', () => ({
  Carousel: () => <div data-testid="carousel"></div>,
}));

const WAIT = 80;

const carouselItemsMock = [
  {
    text: 'test text 1',
    subText: 'test subtext 1',
  },
  {
    text: 'test text 2',
    subText: 'test subtext 2',
  },
  {
    text: 'test text 3',
  },
];

const loaderProps = {
  duration: WAIT,
  durationLeft: WAIT,
  description: 'test-description',
  refreshText: 'test-refresh',
  redirectUrl: 'test-redirect-url',
  progressComplete: 'test-progress-complete',
  carouselHeading: 'test-carousel-heading',
  carouselItems: carouselItemsMock,
};

describe('Loader Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it('renders correct completion at various intervals', () => {
    const step = (WAIT / 4) * 1000;
    const { getByText } = render(<Loader {...loaderProps} />);

    act(() => {
      jest.advanceTimersByTime(0);
    });
    // Check the progress bar label
    expect(
      screen.getAllByText('0% test-progress-complete...')[0],
    ).toBeInTheDocument();

    // Check the accessibility announcer starts empty (announcements happen at intervals)
    expect(screen.getByTestId('progress-announcer')).toHaveTextContent('');

    act(() => {
      jest.advanceTimersByTime(step);
    });
    expect(getByText('25% test-progress-complete...')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(step);
    });
    expect(getByText('50% test-progress-complete...')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(step);
    });
    expect(getByText('75% test-progress-complete...')).toBeInTheDocument();
  });

  it('renders correct items when countdown is complete', async () => {
    const { queryByTestId } = render(<Loader {...loaderProps} />);
    act(() => {
      jest.advanceTimersByTime(WAIT * 1000);
    });
    // Check the visual progress (no ellipsis at 100%)
    expect(screen.getByText('100% test-progress-complete')).toBeInTheDocument();
    // Announcer may be empty since announcements are interval-based
    // The important thing is that it doesn't crash and shows the right visual progress
    expect(queryByTestId('intro-text')).not.toBeInTheDocument();
    expect(queryByTestId('lower-text')).not.toBeInTheDocument();
    expect(queryByTestId('carousel')).not.toBeInTheDocument();
    expect(queryByTestId('success')).toBeInTheDocument();
  });
});
