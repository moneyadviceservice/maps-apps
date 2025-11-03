import { DocumentTemplate } from 'types/@adobe/page';
import { render, screen } from '@testing-library/react';

import { DocumentSummary } from './DocumentSummary';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn().mockReturnValue({
    z: (key: { en: string; cy: string }) => key.en,
  }),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/',
  }),
}));

const mockDoc: DocumentTemplate = {
  seoTitle: 'SEO Title',
  seoDescription: 'This is a test description',
  title: 'Sample Document',
  slug: 'sample-document',
  publishDate: '2023-01-01T00:00:00Z',
  lastUpdatedDate: '2023-01-05T00:00:00Z',
  pageType: { key: 'report', name: 'Report' },
  dataType: [{ key: 'json', name: 'JSON' }],
  tags: [],
  breadcrumbs: [],
  sections: [],
  contactInformation: { json: [] },
  clientGroup: [{ key: 'gov', name: 'Government' }],
  topic: [{ key: 'health', name: 'Health' }],
  countryOfDelivery: [{ key: 'us', name: 'USA' }],
  links: [],
  overview: { json: [] },
};

describe('DocumentSummary', () => {
  it('renders document title, description, and link', () => {
    const { container, getByText, getByRole } = render(
      <DocumentSummary doc={mockDoc} lang="en" />,
    );

    expect(getByText('Sample Document')).toBeInTheDocument();

    const link = getByRole('link', { name: /View evidence summary/i });
    expect(link).toHaveAttribute(
      'href',
      '/en/evidence-library/report/sample-document',
    );

    expect(container).toMatchSnapshot();
  });

  it('renders year of publication when publishDate is available', () => {
    render(<DocumentSummary doc={mockDoc} lang="en" />);

    const yearText = screen.getByText('Year of publication');
    expect(yearText).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('does not render year of publication when publishDate is not available', () => {
    const docWithoutDate = {
      ...mockDoc,
      publishDate: undefined,
    } as unknown as DocumentTemplate;

    render(<DocumentSummary doc={docWithoutDate} lang="en" />);

    expect(screen.queryByText('Year of publication')).not.toBeInTheDocument();
  });

  it('renders with different language', () => {
    render(<DocumentSummary doc={mockDoc} lang="cy" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      '/cy/evidence-library/report/sample-document',
    );
  });
});
