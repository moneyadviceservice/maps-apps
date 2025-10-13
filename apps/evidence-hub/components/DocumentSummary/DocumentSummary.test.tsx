import { DocumentTemplate } from 'types/@adobe/page';
import { render } from '@testing-library/react';

import { DocumentSummary } from './DocumentSummary';

import '@testing-library/jest-dom';

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
      '/en/evidence-hub/report/sample-document',
    );

    expect(container).toMatchSnapshot();
  });
});
