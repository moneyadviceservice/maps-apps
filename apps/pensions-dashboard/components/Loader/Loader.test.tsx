import React from 'react';
import { render, screen, act } from '@testing-library/react';
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

describe('Loader Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it('renders initial text and progress bar', () => {
    const { getByTestId } = render(<Loader duration={WAIT} />);
    const loader = getByTestId('loader');
    expect(loader).toMatchSnapshot();
  });

  it('renders the carousel', () => {
    const { queryByTestId } = render(<Loader duration={WAIT} />);
    expect(queryByTestId('carousel')).toBeInTheDocument();
  });

  it('renders correct completion at various intervals', () => {
    const step = (WAIT / 4) * 1000;
    const { getByText } = render(<Loader duration={WAIT} />);
    expect(screen.getByText('0% complete')).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(step));
    expect(getByText('25% complete')).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(step));
    expect(getByText('50% complete')).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(step));
    expect(getByText('75% complete')).toBeInTheDocument();
  });

  it('renders correct items when countdown is complete', () => {
    const { queryByTestId, getByText } = render(<Loader duration={WAIT} />);
    act(() => jest.advanceTimersByTime(WAIT * 1000));
    expect(getByText('100% complete')).toBeInTheDocument();
    expect(queryByTestId('intro-text')).not.toBeInTheDocument();
    expect(queryByTestId('lower-text')).not.toBeInTheDocument();
    expect(queryByTestId('carousel')).not.toBeInTheDocument();
    expect(queryByTestId('success')).toBeInTheDocument();
  });
});
