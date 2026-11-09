import { act, fireEvent, render } from '@testing-library/react';

import * as GridStepContainerModule from '../GridStepContainer/GridStepContainer';
import * as StepContainerModule from '../StepContainer';
import { Results } from './Results';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
  }),
}));

jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    addEvent: jest.fn(),
  }),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: jest.fn((obj) => obj.en),
  }),
}));

jest.mock('copy-to-clipboard', () => jest.fn());

const props = {
  heading: 'Test Heading',
  mainContent: <div data-testid="main-content">Main content</div>,
  extraContent: <div data-testid="extra-content">Extra content</div>,
  backLink: '/back',
  firstStep: '/start',
  copyUrlText: {
    en: 'Copy link',
    cy: 'Copïo dolen',
  },
  intro: 'This is the intro text',
};

describe('Results Component', () => {
  it('renders correctly with provided props', () => {
    const { getByTestId } = render(<Results {...props} />);

    expect(getByTestId('results-page-heading')).toBeInTheDocument();
    expect(getByTestId('results-intro')).toBeInTheDocument();

    expect(getByTestId('main-content')).toBeInTheDocument();
    expect(getByTestId('extra-content')).toBeInTheDocument();

    expect(getByTestId('copy-link')).toBeInTheDocument();
    expect(getByTestId('start-again-link')).toBeInTheDocument();
  });

  it('renders without action buttons', () => {
    const { queryByTestId } = render(
      <Results {...props} displayActionButtons={false} />,
    );
    expect(queryByTestId('copy-link')).not.toBeInTheDocument();
    expect(queryByTestId('start-again-link')).not.toBeInTheDocument();
  });

  it('renders without intro, firstStep and extraContent', () => {
    const { queryByTestId } = render(
      <Results
        {...props}
        intro={undefined}
        extraContent={undefined}
        firstStep={undefined}
      />,
    );
    expect(queryByTestId('results-intro')).not.toBeInTheDocument();
    expect(queryByTestId('start-again-link')).not.toBeInTheDocument();
    expect(queryByTestId('extra-content')).not.toBeInTheDocument();
  });

  it("renders link copied text when 'Copy your custom action plan link' button is clicked", () => {
    jest.useFakeTimers();

    const { getByTestId } = render(
      <Results
        {...props}
        copyUrlText={{
          en: 'Test Copy Button Text (en)',
          cy: 'Test Copy Button Text',
        }}
        displayActionButtons={true}
      />,
    );

    const button = getByTestId('copy-link');

    expect(button.textContent).toEqual('Test Copy Button Text (en)');

    fireEvent.click(button);

    expect(button.textContent).toEqual('Link copied!');

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(button.textContent).toEqual('Test Copy Button Text (en)');

    jest.useRealTimers();
  });

  it('calls GridStepContainer when layout is grid', () => {
    const gridSpy = jest.spyOn(GridStepContainerModule, 'GridStepContainer');
    render(<Results {...props} layout="grid" />);
    expect(gridSpy).toHaveBeenCalled();
    gridSpy.mockRestore();
  });

  it('calls StepContainer when layout is not grid', () => {
    const stepSpy = jest.spyOn(StepContainerModule, 'StepContainer');
    render(<Results {...props} layout="default" />);
    expect(stepSpy).toHaveBeenCalled();
    stepSpy.mockRestore();
  });
  it('copies the full URL when removeEmbedFromUrl is false', () => {
    const copyMock = require('copy-to-clipboard');
    copyMock.mockClear();

    const { getByTestId } = render(
      <Results
        {...props}
        removeEmbedFromUrl={false}
        copyUrlText={{
          en: 'Test Copy Button Text (en)',
          cy: 'Test Copy Button Text',
        }}
        displayActionButtons={true}
      />,
    );

    const button = getByTestId('copy-link');
    fireEvent.click(button);
    expect(copyMock).toHaveBeenCalledWith(globalThis.location.href);
  });
  it('clears previous timeout when copy is clicked multiple times quickly', () => {
    jest.useFakeTimers();

    const { getByTestId } = render(
      <Results
        {...props}
        copyUrlText={{
          en: 'Test Copy Button Text (en)',
          cy: 'Test Copy Button Text',
        }}
        displayActionButtons={true}
      />,
    );

    const button = getByTestId('copy-link');

    fireEvent.click(button);
    expect(button.textContent).toEqual('Link copied!');

    // Click again before timeout expires
    fireEvent.click(button);
    expect(button.textContent).toEqual('Link copied!');

    // Advance time less than 3s, should still show copied
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(button.textContent).toEqual('Link copied!');

    // Advance remaining time, should revert
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(button.textContent).toEqual('Test Copy Button Text (en)');

    jest.useRealTimers();
  });
});
