import { DocumentTemplate } from 'types/@adobe/page';
import { render } from '@testing-library/react';

import { DocumentMetaGrid } from './DocumentMetaGrid';

import '@testing-library/jest-dom';

const baseDoc: DocumentTemplate = {
  seoTitle: 'SEO Title',
  seoDescription: 'SEO Description',
  title: 'Test Doc',
  slug: 'test-doc',
  publishDate: '2022-03-15T00:00:00Z',
  sections: [],
  contactInformation: { json: [] },
  topic: [{ key: 'health', name: 'Health' }],
  countryOfDelivery: [{ key: 'us', name: 'USA' }],
  links: [],
  pageType: { key: 'page-report', name: 'Page Report' },
  dataTypes: [{ key: 'data-report', name: 'Data Report' }],
  clientGroup: [{ key: 'adults', name: 'Adults' }],
  tags: [],
  breadcrumbs: [],
};

describe('DocumentMetaGrid', () => {
  it('renders all four columns when data is present', () => {
    const { container, getByText } = render(<DocumentMetaGrid doc={baseDoc} />);

    expect(getByText('Evidence type')).toBeInTheDocument();
    expect(getByText('Topics')).toBeInTheDocument();
    expect(getByText('Country')).toBeInTheDocument();
    expect(getByText('Population Group')).toBeInTheDocument();

    expect(getByText('Page Report:')).toBeInTheDocument();
    expect(getByText('Data Report')).toBeInTheDocument();
    expect(getByText('Health')).toBeInTheDocument();
    expect(getByText('USA')).toBeInTheDocument();
    expect(getByText('Adults')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('renders only visible columns when some fields are missing', () => {
    const partialDoc: DocumentTemplate = {
      ...baseDoc,
      pageType: undefined,
      dataTypes: undefined,
      topic: [],
      countryOfDelivery: [],
      clientGroup: [],
    };

    const { queryByText } = render(<DocumentMetaGrid doc={partialDoc} />);

    expect(queryByText('Evidence type')).not.toBeInTheDocument();
    expect(queryByText('Topics')).not.toBeInTheDocument();
    expect(queryByText('Country')).not.toBeInTheDocument();
    expect(queryByText('Population Group')).not.toBeInTheDocument();

    expect(queryByText('Page Report')).not.toBeInTheDocument();
    expect(queryByText('Data Report')).not.toBeInTheDocument();
    expect(queryByText('Health')).not.toBeInTheDocument();
    expect(queryByText('USA')).not.toBeInTheDocument();
    expect(queryByText('Adults')).not.toBeInTheDocument();
  });
});
