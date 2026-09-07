import { ReactNode } from 'react';

import { render, screen } from '@testing-library/react';

import { useContextLanguage } from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { CalloutSection } from './CalloutSection';

jest.mock('@maps-react/hooks/useLanguage', () => ({
  useContextLanguage: jest.fn(),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(),
}));

interface MockProps {
  children?: ReactNode;
}

interface MockLinkProps extends MockProps {
  href?: string;
}

interface MockListElementProps {
  items: ReactNode[];
}

jest.mock('@maps-react/common/components/Heading', () => ({
  Heading: ({ children }: MockProps) => <h3>{children}</h3>,
}));

jest.mock('@maps-react/common/components/Paragraph', () => ({
  Paragraph: ({ children }: MockProps) => <p>{children}</p>,
}));

jest.mock('@maps-react/common/components/UrgentCallout', () => ({
  UrgentCallout: ({ children }: MockProps) => (
    <div data-testid="urgent-callout">{children}</div>
  ),
}));

jest.mock('@maps-react/common/components/Link', () => ({
  Link: ({ children, href }: MockLinkProps) => <a href={href}>{children}</a>,
}));

jest.mock('@maps-react/common/components/ListElement', () => ({
  ListElement: ({ items }: MockListElementProps) => (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  ),
}));

describe('CalloutSection', () => {
  const mockUseContextLanguage = useContextLanguage as jest.Mock;
  const mockUseTranslation = useTranslation as jest.Mock;

  const setupComponent = (lang: 'en' | 'cy' = 'en') => {
    mockUseContextLanguage.mockReturnValue(lang);
    mockUseTranslation.mockReturnValue({
      z: (dictionary: Record<'en' | 'cy', string>) => dictionary[lang],
    });

    return render(<CalloutSection />);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders English text and URLs by default', () => {
    setupComponent('en');

    expect(
      screen.getByText('Need more information on pensions?'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/One of our pension specialists will be happy/i),
    ).toBeInTheDocument();
    expect(screen.getByText('use our webchat')).toBeInTheDocument();

    const webchatLinks = screen.getAllByRole('link', {
      name: /use our (webchat|online form)/i,
    });
    expect(webchatLinks).toHaveLength(2);
    webchatLinks.forEach((link) => {
      expect(link).toHaveAttribute(
        'href',
        'https://www.moneyhelper.org.uk/PensionsChat',
      );
    });
  });

  it('renders Welsh text and URLs when language is set to "cy"', () => {
    setupComponent('cy');

    expect(
      screen.getByText('Angen mwy o wybodaeth am bensiynau?'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Bydd un o'n harbenigwyr pensiwn yn hapus i ateb eich cwestiynau:",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('defnyddiwch ein gwe-sgwrsYn.'),
    ).toBeInTheDocument();

    const welshChatLink = screen.getByRole('link', {
      name: 'defnyddiwch ein gwe-sgwrsYn.',
    });
    expect(welshChatLink).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/welshchat',
    );
  });

  it('renders the static telephone link correctly regardless of language', () => {
    setupComponent('en');

    const telLink = screen.getByRole('link', { name: '0800 011 3797' });
    expect(telLink).toHaveAttribute('href', 'tel:08000113797');
  });
});
