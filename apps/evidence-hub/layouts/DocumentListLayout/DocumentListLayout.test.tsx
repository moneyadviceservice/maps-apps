import { DocumentTemplate, Tag } from 'types/@adobe/page';
import { render, screen } from '@testing-library/react';

import { DocumentListLayout } from './DocumentListLayout';

import '@testing-library/jest-dom';

jest.mock('components/DocumentSummary', () => ({
  DocumentSummary: ({ doc }: { doc: DocumentTemplate }) => (
    <div data-testid="document-summary">{doc.title}</div>
  ),
}));
jest.mock('components/SideNavigation', () => ({
  SideNavigation: ({ tags }: { tags: { label: string; tags: Tag[] }[] }) => (
    <nav data-testid="side-navigation">{tags.length} tags</nav>
  ),
}));

const baseDoc: DocumentTemplate = {
  seoTitle: 'SEO Title',
  seoDescription: 'SEO description',
  title: 'Sample Doc',
  slug: 'sample-doc',
  publishDate: '2023-01-01T00:00:00Z',
  sections: [],
  contactInformation: { json: [] },
  clientGroup: [],
  topic: [],
  countryOfDelivery: [],
  links: [],
};

describe('DocumentListLayout', () => {
  it('renders empty state when no documents', () => {
    render(
      <DocumentListLayout
        documents={[]}
        lang="en"
        tags={[{ label: 'Category', tags: [] }]}
        query={{}}
      />,
    );

    expect(
      screen.getByText(
        /We’re sorry, no results have been found for your search./i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId('side-navigation')).toBeInTheDocument();
  });

  it('renders list of documents when provided', () => {
    const { container, getByText, getByTestId } = render(
      <DocumentListLayout
        documents={[baseDoc]}
        lang="en"
        tags={[{ label: 'Category', tags: [] }]}
        query={{}}
      />,
    );

    expect(getByText(/1 document found/i)).toBeInTheDocument();
    expect(getByTestId('document-summary')).toHaveTextContent('Sample Doc');
    expect(container).toMatchSnapshot();
  });
});
