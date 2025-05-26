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
    image: {
      src: '/carousel/costs.svg',
      height: 102,
      width: 82,
      alt: 'test alt 1',
    },
    text: 'test text 1',
    subText: 'test subtext 1',
  },
  {
    image: {
      src: '/carousel/savings.svg',
      height: 85,
      width: 101,
      alt: 'test alt 2',
    },
    text: 'test text 2',
    subText: 'test subtext 2',
  },
  {
    image: {
      src: '/carousel/briefcase.svg',
      height: 117,
      width: 95,
      alt: 'test alt 3',
    },
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

  it('renders the carousel', () => {
    act(() => {
      render(<Loader {...loaderProps} />);
    });
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
  });

  it('renders correct completion at various intervals', () => {
    const step = (WAIT / 4) * 1000;
    const { getByText } = render(<Loader {...loaderProps} />);

    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.getByText('0% test-progress-complete')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(step);
    });
    expect(getByText('25% test-progress-complete')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(step);
    });
    expect(getByText('50% test-progress-complete')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(step);
    });
    expect(getByText('75% test-progress-complete')).toBeInTheDocument();
  });

  it('renders correct items when countdown is complete', async () => {
    const { queryByTestId, getByText } = render(<Loader {...loaderProps} />);
    act(() => {
      jest.advanceTimersByTime(WAIT * 1000);
    });
    await screen.findByText('100% test-progress-complete');
    expect(getByText('100% test-progress-complete')).toBeInTheDocument();
    expect(queryByTestId('intro-text')).not.toBeInTheDocument();
    expect(queryByTestId('lower-text')).not.toBeInTheDocument();
    expect(queryByTestId('carousel')).not.toBeInTheDocument();
    expect(queryByTestId('success')).toBeInTheDocument();
  });
});
