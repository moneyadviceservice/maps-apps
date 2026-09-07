import { JsonRichText } from '@maps-react/vendor/utils/RenderRichText';

export type RichTextInput = JsonRichText | { plaintext: string };

const richTextTextCache = new WeakMap<object, string>();

/**
 * Extract plain text from JsonRichText.
 * Caches by object identity so the same node is not walked twice.
 */
export function extractTextFromRichText(
  richText: RichTextInput | undefined,
): string {
  if (!richText) return '';
  if ('plaintext' in richText && typeof richText.plaintext === 'string') {
    return richText.plaintext;
  }
  if (!('json' in richText) || !richText.json) return '';

  const cached = richTextTextCache.get(richText);
  if (cached !== undefined) return cached;

  const extractTextFromNode = (node: Record<string, unknown>): string => {
    let text = '';

    if (typeof node.value === 'string') {
      text += node.value;
    }

    if (node.content && Array.isArray(node.content)) {
      text += node.content.map(extractTextFromNode).join(' ');
    }

    return text;
  };

  const extracted = richText.json.map(extractTextFromNode).join(' ').trim();
  richTextTextCache.set(richText, extracted);
  return extracted;
}
