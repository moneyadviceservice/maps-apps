import { render } from '@testing-library/react';
import { BACKGROUND_COLOUR, Theme } from './Theme';

describe('Test Theme component', () => {
  it('should render the component without colour', () => {
    const { container } = render(<Theme>Content</Theme>);

    expect(container).toMatchSnapshot();
  });

  it('should render the component in light grey', () => {
    const { container } = render(
      <Theme theme={BACKGROUND_COLOUR.GREY}>Content</Theme>,
    );

    expect(container).toMatchSnapshot();
  });
});
