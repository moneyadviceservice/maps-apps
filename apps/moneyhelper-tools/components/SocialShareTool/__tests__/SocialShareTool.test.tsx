import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import { SocialShareTool } from '../SocialShareTool';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('SocialShareTool component', () => {
  it('renders correctly', () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { language: 'en' },
      pathname: '/',
    });

    const { container } = render(
      <SocialShareTool
        url="https://example.com"
        title="Share this tool"
        subject="moneyhelper"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
