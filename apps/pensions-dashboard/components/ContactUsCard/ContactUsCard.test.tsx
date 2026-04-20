import { render, screen } from '@testing-library/react';

import { IconType } from '@maps-react/common/components/Icon';

import { ContactUsCard } from './ContactUsCard';

import '@testing-library/jest-dom/extend-expect';

const defaultProps = {
  title: 'Webchat',
  icon: IconType.CONTACT_WEB_CHAT,
  subtitle: 'Chat to us',
  availability: 'Mon – Fri 9am to 5pm',
  heading: 'Start a webchat',
  children: <span>Child content</span>,
};

describe('ContactUsCard', () => {
  it('matches snapshot with default props', () => {
    const { container } = render(<ContactUsCard {...defaultProps} />);

    expect(container).toMatchSnapshot();
  });

  it('renders title, subtitle, availability, heading, and children', () => {
    render(<ContactUsCard {...defaultProps} />);

    expect(screen.getByText('Webchat')).toBeInTheDocument();
    expect(screen.getByText('Chat to us')).toBeInTheDocument();
    expect(screen.getByText('Mon – Fri 9am to 5pm')).toBeInTheDocument();
    expect(screen.getByText('Start a webchat')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });
});
