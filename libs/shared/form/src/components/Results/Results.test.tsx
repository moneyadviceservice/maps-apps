import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import { Results } from './Results';

import '@testing-library/jest-dom/extend-expect';

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
});
