import { render } from '@testing-library/react';

import { Link } from '@maps-react/common/components/Link';

import { Landing } from './Landing';

import '@testing-library/jest-dom/extend-expect';

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
});
