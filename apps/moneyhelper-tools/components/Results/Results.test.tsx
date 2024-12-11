import React from 'react';

import { render } from '@testing-library/react';

import { Results } from './Results';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({ z: () => 'mock-translate' }),
}));

jest.mock('copy-to-clipboard', () => jest.fn());

const props = {
  heading: 'Sample Heading',
  intro: 'Sample Intro',
  mainContent: <div data-testid="main-content">Main Content</div>,
  extraContent: <div data-testid="extra-content">Extra Content</div>,
  backLink: '/back',
  firstStep: '/first',
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
});
