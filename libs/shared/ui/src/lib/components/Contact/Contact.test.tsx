import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Contact } from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('Contact component', () => {
  it('renders correctly', () => {
    render(<Contact />);
    const contact = screen.getByTestId('contact');
    expect(contact).toMatchSnapshot();
  });

  it('renders correctly pensions opened', () => {
    render(<Contact />);
    const contactPensions = screen.getByTestId('contact');
    fireEvent.click(screen.getByTestId('contact-open'));
    fireEvent.click(screen.getByTestId('pensions'));
    fireEvent.click(screen.getByTestId('telephone'));
    fireEvent.click(screen.getByTestId('contact-back'));
    fireEvent.click(screen.getByTestId('webForm'));
    fireEvent.click(screen.getByTestId('contact-back'));
    fireEvent.click(screen.getByTestId('webChat'));
    expect(contactPensions).toMatchSnapshot();
  });

  it('renders correctly money opened', () => {
    render(<Contact />);
    const contactMoney = screen.getByTestId('contact');
    fireEvent.click(screen.getByTestId('contact-open'));
    fireEvent.click(screen.getByTestId('money'));
    fireEvent.click(screen.getByTestId('whatsapp'));
    expect(contactMoney).toMatchSnapshot();
  });

  it('renders correctly money opened and closed', () => {
    render(<Contact />);
    const contactOpenClose = screen.getByTestId('contact');
    fireEvent.click(screen.getByTestId('contact-open'));
    fireEvent.click(screen.getByTestId('money'));
    fireEvent.click(screen.getByTestId('whatsapp'));
    fireEvent.click(screen.getByTestId('contact-close'));
    expect(contactOpenClose).toMatchSnapshot();
  });
});
