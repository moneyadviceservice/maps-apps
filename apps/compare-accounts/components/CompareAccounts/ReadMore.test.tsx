import { fireEvent, render, screen } from '@testing-library/react';

import ReadMore from './ReadMore';

import '@testing-library/jest-dom';

const text =
  '* There is a charge of up to £8.00 for sending international payments out to countries within Europe. There is a charge of 0.25%, minimum £13, maximum £35 for sending international payments out to countries outside Europe. No fee if payment is transferred by SEPA in euro to an EU member state';

describe('ReadMore Component', () => {
  it('displays the truncated text and hides the rest by default', () => {
    render(<ReadMore value={text} />);

    expect(
      screen.getByText(
        /There is a charge of up to £8\.00 for sending international payments out to countries within Europe\./,
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(
        /payments out to countries outside Europe. No fee if payment is transferred by SEPA in euro to an EU member state/,
      ),
    ).not.toBeInTheDocument();

    expect(screen.getByText('[Read more]')).toBeInTheDocument();
  });

  it('shows the full text when the "Read more" button is clicked', () => {
    render(<ReadMore value={text} />);

    const readMoreButton = screen.getByText('[Read more]');
    expect(readMoreButton).toBeInTheDocument();

    fireEvent.click(readMoreButton);

    expect(
      screen.getByText(
        /payments out to countries outside Europe. No fee if payment is transferred by SEPA in euro to an EU member state/,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText('[Read less]')).toBeInTheDocument();
  });

  it('collapses the text back when the "Read less" button is clicked', () => {
    render(<ReadMore value={text} />);

    const readMoreButton = screen.getByText('[Read more]');
    fireEvent.click(readMoreButton);

    const readLessButton = screen.getByText('[Read less]');
    fireEvent.click(readLessButton);

    expect(
      screen.queryByText(
        /payments out to countries outside Europe. No fee if payment is transferred by SEPA in euro to an EU member state/,
      ),
    ).not.toBeInTheDocument();

    expect(screen.getByText('[Read more]')).toBeInTheDocument();
  });
});
