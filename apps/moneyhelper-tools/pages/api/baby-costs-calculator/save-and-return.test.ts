import { NextApiRequest, NextApiResponse } from 'next';

import { validateEmail } from '@maps-react/utils/validateEmail';

import { addEmbedQuery } from '@maps-react/utils/addEmbedQuery';

import handler from './save-and-return';

jest.mock('notifications-node-client', () => ({
  NotifyClient: jest.fn().mockImplementation(() => {
    return {
      sendEmail: jest.fn().mockResolvedValue({}),
    };
  }),
}));

jest.mock('@maps-react/utils/validateEmail');
jest.mock('@maps-react/utils/addEmbedQuery');

describe('handler', () => {
  let request: NextApiRequest;
  let response: NextApiResponse;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let redirectMock: jest.Mock;

  beforeEach(() => {
    request = {
      body: {
        language: 'en',
        email: 'test@example.com',
        savedData: '{"key":"value"}',
        isEmbed: 'true',
        tab: 'tab',
        toolBaseUrl: 'http://example.com/',
      },
      headers: {
        origin: 'http://example.com',
      },
    } as unknown as NextApiRequest;

    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    redirectMock = jest.fn();

    response = {
      status: statusMock,
      redirect: redirectMock,
    } as unknown as NextApiResponse;

    (validateEmail as jest.Mock).mockReturnValue(true);
    (addEmbedQuery as jest.Mock).mockReturnValue('&embed=true');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send email and redirect correctly for a valid email', async () => {
    await handler(request, response);

    expect(validateEmail).toHaveBeenCalledWith('test@example.com');

    expect(redirectMock).toHaveBeenCalledWith(
      302,
      'http://example.com/save?key=value&tab=tab&saved=true&embed=true',
    );
  });

  it('should handle invalid email and redirect with error', async () => {
    (validateEmail as jest.Mock).mockReturnValue(false);

    await handler(request, response);

    expect(validateEmail).toHaveBeenCalledWith('test@example.com');

    expect(redirectMock).toHaveBeenCalledWith(
      302,
      'http://example.com/save?key=value&tab=tab&error=email&embed=true',
    );
  });
});
