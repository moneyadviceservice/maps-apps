import { render, screen } from '@testing-library/react';

import { BreadcrumbWrapper } from '.';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('BreadcrumbWrapper component', () => {
  it('renders breadcumbs correctly', () => {
    render(
      <BreadcrumbWrapper
        lang="en"
        title="Spending guidelines"
        slug={['/spending-guidelines']}
        breadcrumbs={[
          {
            linkTo: '/use-the-sfs',
            text: 'SFS',
            description: '',
          },
          {
            linkTo: '/spending-guidelines',
            text: 'Standard Financial Statement',
            description: '',
          },
        ]}
      />,
    );
    const breadcrumbWrapper = screen.getByTestId('breadcrumb-wrapper');
    expect(breadcrumbWrapper).toMatchSnapshot();
  });

  it('renders no breadcumbs if no data passed in', () => {
    const { container } = render(
      <BreadcrumbWrapper
        lang="en"
        title="Spending guidelines"
        slug={['/spending-guidelines']}
        breadcrumbs={[]}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
