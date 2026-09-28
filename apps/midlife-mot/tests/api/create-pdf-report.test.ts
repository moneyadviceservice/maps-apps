import { NextApiRequest, NextApiResponse } from 'next';

import handler from 'pages/api/create-pdf-report';

import { Font, renderToBuffer } from '@react-pdf/renderer';

jest.mock('@react-pdf/renderer', () => {
  const React = require('react');
  const stub = ({ children }: { children?: React.ReactNode }) =>
    React.createElement('div', null, children);
  return {
    Document: stub,
    Page: stub,
    View: stub,
    Text: stub,
    Link: stub,
    Image: stub,
    StyleSheet: { create: <T>(styles: T): T => styles },
    Font: { register: jest.fn(), registerHyphenationCallback: jest.fn() },
    renderToBuffer: jest.fn(),
  };
});

const mockRenderToBuffer = renderToBuffer as jest.MockedFunction<
  typeof renderToBuffer
>;

const validBody = {
  language: 'en',
  data: JSON.stringify({
    highRiskGroup: {},
    mediumRiskGroup: {},
    lowRiskGroup: {},
  }),
  content: JSON.stringify({ pdfTitle: 'Title', description: 'Description' }),
  groups: JSON.stringify([]),
};

const mockRequest = (overrides: Partial<NextApiRequest> = {}) =>
  ({ method: 'POST', body: validBody, ...overrides } as NextApiRequest);

const mockResponse = () => {
  const res = {
    setHeader: jest.fn(),
    status: jest.fn(),
    send: jest.fn(),
    end: jest.fn(),
  };
  res.status.mockReturnValue(res);
  return res as unknown as NextApiResponse & typeof res;
};

describe('create-pdf-report API route', () => {
  // Only reset the render mock: Font.register/registerHyphenationCallback
  // record their module-load calls, which the first test asserts.
  beforeEach(() => {
    mockRenderToBuffer.mockReset();
  });

  it('registers the Manrope font family and disables hyphenation at module load', () => {
    expect(Font.register).toHaveBeenCalledWith(
      expect.objectContaining({
        family: 'Manrope',
        fonts: [
          expect.objectContaining({ fontWeight: 400 }),
          expect.objectContaining({ fontWeight: 700 }),
        ],
      }),
    );
    expect(Font.registerHyphenationCallback).toHaveBeenCalled();
  });

  it('responds 405 to non-POST requests without rendering', async () => {
    const res = mockResponse();

    await handler(mockRequest({ method: 'GET' }), res);

    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST');
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalled();
    expect(mockRenderToBuffer).not.toHaveBeenCalled();
  });

  it('returns the rendered PDF with download headers for English', async () => {
    const buffer = Buffer.from('pdf');
    mockRenderToBuffer.mockResolvedValue(buffer);
    const res = mockResponse();

    await handler(mockRequest(), res);

    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/pdf',
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename="Money Midlife MOT.pdf"',
    );
    expect(res.setHeader).toHaveBeenCalledWith('Content-Length', buffer.length);
    expect(res.send).toHaveBeenCalledWith(buffer);
  });

  it('uses the Welsh filename when the language is cy', async () => {
    mockRenderToBuffer.mockResolvedValue(Buffer.from('pdf'));
    const res = mockResponse();

    await handler(mockRequest({ body: { ...validBody, language: 'cy' } }), res);

    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename="MOT Canol Oes Arian.pdf"',
    );
  });

  it('responds 500 when the posted JSON is malformed', async () => {
    const res = mockResponse();

    await handler(
      mockRequest({ body: { ...validBody, data: 'not-json' } }),
      res,
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error generating PDF report');
    expect(mockRenderToBuffer).not.toHaveBeenCalled();
  });

  it('responds 500 when rendering fails', async () => {
    mockRenderToBuffer.mockRejectedValue(new Error('render failed'));
    const res = mockResponse();

    await handler(mockRequest(), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error generating PDF report');
  });
});
