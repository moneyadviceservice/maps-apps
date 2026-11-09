import { render, screen } from '@testing-library/react';

import { DownloadStatementButton } from '.';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('DownloadStatementButton component', () => {
  it('renders correctly', () => {
    render(<DownloadStatementButton onClick={jest.fn()} />);
    const button = screen.getByTestId('download-statement-button');
    expect(button).toMatchSnapshot();
  });
});
