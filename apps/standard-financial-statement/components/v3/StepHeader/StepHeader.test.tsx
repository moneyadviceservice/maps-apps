import { render, screen } from '@testing-library/react';

import { StepHeader } from '.';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('StepHeader component', () => {
  it('renders correctly', () => {
    render(
      <StepHeader
        progressIndicatorProps={{
          srOnlyText: 'test sr only text',
          sectionText: 'test section',
          stepText: 'test step',
        }}
        mobileText="test mobile text"
        desktopText="test desktop text"
      />,
    );
    const header = screen.getByTestId('step-header');
    expect(header).toMatchSnapshot();
  });
});
