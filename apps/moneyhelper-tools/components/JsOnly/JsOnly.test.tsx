import { render } from '@testing-library/react';
import { JsOnly } from '.';

describe('JsOnly component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <JsOnly fallback={'fallback text'}>
        <ul>
          <li>one</li>
          <li>two</li>
          <li>three</li>
        </ul>
      </JsOnly>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
