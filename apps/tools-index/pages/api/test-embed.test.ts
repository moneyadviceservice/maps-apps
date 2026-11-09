import { NextApiRequest, NextApiResponse } from 'next';

import handler from './test-embed';

type MockRequest = Partial<NextApiRequest> & {
  query: {
    origin: string;
    language: string;
    name: string;
  };
};

type MockResponse = Partial<NextApiResponse> & {
  setHeader: () => void;
  write: () => void;
  end: () => void;
};

describe('handler', () => {
  it('should generate HTML with embed code', () => {
    const req: MockRequest = {
      query: {
        origin: 'https://example.com',
        language: 'en',
        name: 'example',
      },
    };
    const res: MockResponse = {
      setHeader: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    };

    handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'text/html; charset=utf-8',
    );

    expect(res.write).toHaveBeenCalledWith(
      expect.stringContaining('<!DOCTYPE html>'),
    );
    expect(res.write).toHaveBeenCalledWith(expect.stringContaining('<html>'));
    expect(res.write).toHaveBeenCalledWith(expect.stringContaining('<head>'));
    expect(res.write).toHaveBeenCalledWith(
      expect.stringContaining('<title>MoneyHelper Embed Test</title>'),
    );
    expect(res.write).toHaveBeenCalledWith(expect.stringContaining('<body>'));
    expect(res.write).toHaveBeenCalledWith(
      expect.stringContaining(
        '<h1 style="background: #f1f5f9; padding: 10px">',
      ),
    );
    expect(res.write).toHaveBeenCalledWith(
      expect.stringContaining(
        '<div style="border: 1px solid #f1f5f9; padding: 5px;">',
      ),
    );
    expect(res.write).toHaveBeenCalledWith(
      expect.stringContaining(
        '<div style="background: #f1f5f9; padding: 10px; font-size: 24px; font-weight: bold;">',
      ),
    );
    expect(res.write).toHaveBeenCalledWith(expect.stringContaining('</html>'));

    expect(res.end).toHaveBeenCalled();
  });
});
