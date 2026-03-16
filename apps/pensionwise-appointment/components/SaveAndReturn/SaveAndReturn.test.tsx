import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SaveAndReturn from './SaveAndReturn';

jest.mock('../../pages/api/save-and-return', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import saveAndReturn from '../../pages/api/save-and-return';

const mockData = {
  title: 'Save and return',
  slug: 'save-and-return',
  pageDescription: {
    json: [
      {
        nodeType: 'paragraph',
        content: [
          {
            nodeType: 'text',
            value: 'Save your data',
          },
        ],
      },
    ],
  },
  labelText: 'Input email',
  labelSubText: ['Add your email'],
  errorMessageEmail: 'The email is incorrect',
  errorMessageSend: ['The email has failed to be delivered'],
  submitButtonText: 'Send email',
};

const mockPageProps = (err: string | null) => ({
  query: {
    language: 'en',
    ...(err && { error: err }),
  } as Record<string, string>,
  back: '/previous-page',
  app: 'pension-wise-appointment',
});

const renderComponent = () =>
  render(
    <SaveAndReturn data={mockData} nonce="" pageProps={mockPageProps(null)} />,
  );

describe('Save and return component', () => {
  it('should display the component correctly', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
    expect(screen.getByTestId('section-title').innerHTML).toBe(mockData.title);
    expect(screen.getAllByText('Save your data')).toBeTruthy();
    expect(screen.getAllByText(mockData.labelText)).toBeTruthy();
    expect(screen.getAllByText(mockData.labelSubText[0])).toBeTruthy();
  });

  it('should display successfully send the data via email', () => {
    const mockHandler = saveAndReturn as jest.MockedFunction<
      typeof saveAndReturn
    >;
    mockHandler.mockResolvedValueOnce(undefined);
    renderComponent();

    const emailinput = screen.getByTestId('email');
    fireEvent.change(emailinput, { target: { value: 'test@emailinput.com' } });

    fireEvent.click(screen.getByTestId('save-and-return'));

    waitFor(() => expect(mockHandler).toHaveBeenCalled());
  });

  it('should display error message when email validation fails', () => {
    const mockHandler = saveAndReturn as jest.MockedFunction<
      typeof saveAndReturn
    >;
    mockHandler.mockResolvedValueOnce(undefined);
    renderComponent();

    fireEvent.click(screen.getByTestId('save-and-return'));
    waitFor(() =>
      expect(
        screen.getByText(
          'Enter an email address in the correct format, like name@example.com',
        ),
      ).toBeTruthy(),
    );
  });

  it('should display error when API fails', () => {
    render(
      <SaveAndReturn
        data={mockData}
        nonce=""
        pageProps={mockPageProps('fail')}
      />,
    );

    // Error message from query param should be displayed
    waitFor(() =>
      expect(screen.getByText(mockData.errorMessageSend[0])).toBeTruthy(),
    );
  });
});
