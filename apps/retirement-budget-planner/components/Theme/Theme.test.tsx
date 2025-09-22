import { render } from '@testing-library/react';
import { BACKGROUND_COLOUR, Theme } from './Theme';

describe('Test Theme component', () => {
  it('should render the component in green', () => {
    const { container } = render(
      <Theme theme={BACKGROUND_COLOUR.GREEN}>Content</Theme>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render the component in yellow', () => {
    const { container } = render(
      <Theme theme={BACKGROUND_COLOUR.YELLOW}>Content</Theme>,
    );

    expect(container).toMatchSnapshot();
  });
});
