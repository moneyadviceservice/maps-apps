import { ContentCardType } from '../../types/@adobe/components';

import {
  extractPlainText,
  getCardKey,
  isExternalUrl,
  toTeaserCardImage,
} from './homepageCardHelpers';

describe('homepageCardHelpers', () => {
  const card: ContentCardType = {
    title: 'Test Card',
    description: {
      json: [
        {
          nodeType: 'paragraph',
          content: [{ nodeType: 'text', value: 'Card description' }],
        },
      ],
    },
    link: { linkTo: '/test-link', text: 'Test link', description: null },
    image: {
      image: {
        _path: '/content/dam/test.jpg',
        width: 400,
        height: 200,
        mimeType: 'image/jpeg',
      },
      altText: 'Test image',
    },
  };

  describe('extractPlainText', () => {
    it('returns empty string when rich text is missing', () => {
      expect(extractPlainText()).toBe('');
      expect(extractPlainText({ json: [] })).toBe('');
    });

    it('extracts text from rich text nodes', () => {
      expect(extractPlainText(card.description)).toBe('Card description');
    });
  });

  describe('getCardKey', () => {
    it('uses link when available', () => {
      expect(getCardKey(card)).toBe('/test-link');
    });

    it('falls back to title when link is missing', () => {
      expect(getCardKey({ ...card, link: { ...card.link, linkTo: '' } })).toBe(
        'Test Card',
      );
    });
  });

  describe('isExternalUrl', () => {
    it('detects external urls', () => {
      expect(isExternalUrl('https://example.com')).toBe(true);
      expect(isExternalUrl('/internal')).toBe(false);
    });
  });

  describe('toTeaserCardImage', () => {
    it('maps AEM image data to StaticImageData', () => {
      expect(toTeaserCardImage(card, '/assets')).toEqual({
        src: '/assets/content/dam/test.jpg',
        width: 400,
        height: 200,
      });
    });

    it('returns undefined when image path is missing', () => {
      expect(
        toTeaserCardImage(
          {
            ...card,
            image: {
              ...card.image,
              image: { ...card.image.image, _path: '' },
            },
          },
          '/assets',
        ),
      ).toBeUndefined();
    });
  });
});
