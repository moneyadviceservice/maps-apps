import React from 'react';
import { render, screen } from '@testing-library/react';
import { Link } from '.';

describe('Link component', () => {
  it('renders link correctly ', () => {
    render(
      <Link data-testid="link" href="www.test.com">
        This is a link
      </Link>,
    );
    const link = screen.getByTestId('link');
    expect(link).toMatchSnapshot();
  });

  it('renders link correctly with white text ', () => {
    render(
      <Link data-testid="link" href="www.test.com" variant="whiteText">
        This is a link
      </Link>,
    );
    const link = screen.getByTestId('link');
    expect(link).toMatchSnapshot();
  });

  it('renders link correctly as button', () => {
    render(
      <Link data-testid="link" href="www.test.com" asButtonVariant="primary">
        This is a link
      </Link>,
    );
    const link = screen.getByTestId('link');
    expect(link).toMatchSnapshot();
  });

  it('renders link correctly with inline text', () => {
    render(
      <Link data-testid="link" href="www.test.com" asInlineText={true}>
        This is a link
      </Link>,
    );
    const link = screen.getByTestId('link');
    expect(link).toMatchSnapshot();
  });
});
