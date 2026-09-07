import { render } from '@testing-library/react';

import { PensionTypeBottomContent } from './PensionTypeBottomContent';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/common/components/UrgentCallout', () => ({
  UrgentCallout: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock('@maps-react/common/components/Heading', () => ({
  H3: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock('@maps-react/common/components/Paragraph', () => ({
  Paragraph: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock('data/pension-type/bottom-content', () => ({
  bottomContentText: jest.fn(() => ({
    liveChatLink: <>Live Chat</>,
    urgentCallout: {
      heading: 'Heading',
      content1: 'Content 1',
      content2: 'Content 2',
    },
  })),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({ z: jest.fn() })),
}));

describe('PensionTypeBottomContent component', () => {
  it('renders with correct content', () => {
    const { getByText } = render(<PensionTypeBottomContent />);

    expect(getByText('Live Chat')).toBeInTheDocument();

    expect(getByText('Heading')).toBeInTheDocument();
    expect(getByText('Content 1')).toBeInTheDocument();
    expect(getByText('Content 2')).toBeInTheDocument();
  });
});
