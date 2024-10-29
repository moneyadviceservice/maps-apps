import { render } from '@testing-library/react';
import { SocialShareTool } from '../SocialShareTool';

describe('SocialShareTool component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <SocialShareTool
        url="https://example.com"
        title="Share this tool"
        toolName="unit test"
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
