import { render } from '@testing-library/react';

import { CalloutVariant } from '@maps-react/common/components/Callout';
import { IconType } from '@maps-react/common/components/Icon';
import useTranslation from '@maps-react/hooks/useTranslation';

import { mockPensionsSummary } from '../../lib/mocks/api';
import { ChannelCallout } from './ChannelCallout';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

describe('ChannelCallout', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      locale: 'en',
      t: (key: string) => key,
      tList: (key: string) => key,
    });
  });

  const mockPensions = mockPensionsSummary.pensions;

  const mockData = {
    data: mockPensions,
    variant: CalloutVariant.POSITIVE,
    title: 'Test Title',
    description: 'Test Description',
    icon: IconType.CLOCK,
    iconClasses: 'test-icon-class',
    link: '/test-link',
    linkText: 'Test Link Text',
  };

  it('renders correctly', () => {
    const { container } = render(<ChannelCallout {...mockData} />);
    expect(container).toMatchSnapshot();
  });

  it.each([
    ['renders the title', 'Test Title'],
    ['renders the description if provided', 'Test Description'],
  ])('%s', (_, text) => {
    const { getByText } = render(<ChannelCallout {...mockData} />);
    expect(getByText(text)).toBeInTheDocument();
  });

  it('does not render the description if not provided', () => {
    const { queryByText } = render(
      <ChannelCallout {...mockData} description={undefined} />,
    );
    expect(queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('renders the link with correct text and href', () => {
    const { getByText } = render(<ChannelCallout {...mockData} />);
    const linkElement = getByText('Test Link Text');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/en/test-link');
  });
});
