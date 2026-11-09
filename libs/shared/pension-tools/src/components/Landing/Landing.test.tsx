import { render } from '@testing-library/react';

import { Link } from '@maps-react/common/components/Link';

import { Landing } from './Landing';

import '@testing-library/jest-dom/extend-expect';

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/en/test',
    query: { language: 'en' },
  }),
}));

describe('Landing component', () => {
  it('renders correctly', () => {
    const props = {
      intro: 'Introduction',
      timeToComplete: 'Time to complete',
      content: <div>Content</div>,
      actionLink: '/en/action-link',
      actionText: 'Action Text',
      additionalInformation: (
        <span>
          <b>{"If you're dealing with problem debt"}</b>, get help as soon as
          possible. You can find free debt advice using our{' '}
          <Link href={'additional-information-link'} asInlineText={true}>
            Additional Information Link Text
          </Link>
          .
        </span>
      ),
    };

    const { getByText, getByTestId } = render(<Landing {...props} />);

    expect(getByText('Time to complete')).toBeInTheDocument();
    expect(getByText('Introduction')).toBeInTheDocument();
    expect(getByText('Content')).toBeInTheDocument();
    expect(getByText('Action Text')).toBeInTheDocument();
    expect(getByTestId('landing-page-button')).toHaveAttribute(
      'href',
      '/en/action-link',
    );
    expect(getByText('Additional Information')).toBeInTheDocument();
    expect(getByText('Additional Information Link Text')).toHaveAttribute(
      'href',
      'additional-information-link',
    );
  });

  it('renders content after the button and omits optional sections when not provided', () => {
    const { getByText, getByTestId, queryByText } = render(
      <Landing
        intro="Introduction"
        content={<div>Main Content</div>}
        contentAfterButton={<div>After Button Content</div>}
        actionLink="/en/action-link"
        actionText="Action Text"
      />,
    );

    expect(getByText('Main Content')).toBeInTheDocument();
    expect(getByText('After Button Content')).toBeInTheDocument();
    expect(getByTestId('landing-page-button')).toHaveAttribute(
      'href',
      '/en/action-link',
    );
    expect(queryByText('Additional Information')).not.toBeInTheDocument();
    expect(queryByText('Time to complete')).not.toBeInTheDocument();
  });

  it('renders with grid layout when requested', () => {
    const { container } = render(
      <Landing
        intro="Introduction"
        content={<div>Grid Content</div>}
        actionLink="/en/action-link"
        actionText="Action Text"
        layout="grid"
      />,
    );

    const gridContentContainer = container.querySelector(
      '.col-span-12.lg\\:col-span-10.xl\\:col-span-8',
    );

    expect(gridContentContainer).toBeInTheDocument();
  });
});
