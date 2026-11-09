import { render, screen } from '@testing-library/react';

import { ProgressIndicator } from '.';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('ProgressIndicator component', () => {
  it('renders correctly', () => {
    render(
      <ProgressIndicator
        srOnlyText="test sr only text"
        sectionText="test section"
        stepText="test step"
      />,
    );
    const indicator = screen.getByTestId('progress-indicator');
    expect(indicator).toMatchSnapshot();
  });
});
