import { fireEvent, render, screen } from '@testing-library/react';
import { Tool } from './Tool';

jest.mock('copy-to-clipboard', () => () => true);

describe('Select component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <Tool name="Test" title="test one" description="test" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly', () => {
    const { container } = render(
      <Tool name="Test" title="test two" description="test" />,
    );
    fireEvent.click(screen.getByTestId('copy-embed-test-two'));
    fireEvent.change(screen.getByTestId('language-select'));
    expect(container).toMatchSnapshot();
  });
});
