import { createMocks } from 'node-mocks-http';
import handler from './filter';
import { NextApiRequest, NextApiResponse } from 'next';

describe('filter API handler', () => {
  describe('addFiltersToParams', () => {
    it('should redirect to the correct URL with query params', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        query: {
          lang: 'en',
          'category-1': 'cat-1-filter-1',
          'category-2': 'cat-2-filter-1',
        },
      });

      await handler(req, res);

      expect(res._getRedirectUrl()).toBe(
        '/en/learning-pathway?category-1=cat-1-filter-1&category-2=cat-2-filter-1',
      );
    });

    it('should join array values with a comma', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        query: {
          lang: 'en',
          'category-1': ['cat-1-filter-1', 'cat-1-filter-2'],
        },
      });

      await handler(req, res);

      expect(res._getRedirectUrl()).toBe(
        '/en/learning-pathway?category-1=cat-1-filter-1%2Ccat-1-filter-2',
      );
    });

    it('should exclude params with empty values', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        query: {
          lang: 'en',
          'category-1': '',
        },
      });

      await handler(req, res);

      expect(res._getRedirectUrl()).toBe('/en/learning-pathway?');
    });

    it('should redirect to Welsh URL when lang is cy', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        query: {
          lang: 'cy',
          'category-1': 'cat-1-filter-1',
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(302);
      expect(res._getRedirectUrl()).toBe(
        '/cy/learning-pathway?category-1=cat-1-filter-1',
      );
    });

    it('should redirect without filters when only lang is provided', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        query: {
          lang: 'en',
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(302);
      expect(res._getRedirectUrl()).toBe('/en/learning-pathway?');
    });

    it('should return 405 for disallowed methods', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'PUT',
        query: {
          lang: 'en',
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(res._getJSONData()).toEqual({
        error: 'Method not allowed',
        allowedMethods: ['POST', 'GET'],
      });
    });
  });
});
