import { promisify } from 'node:util';
import zlib from 'node:zlib';

/**
 * Compress a string using zlib deflate and encode as base64.
 * Reduces payload size (e.g. for Redis or blob storage).
 */
export async function compress(string: string): Promise<string> {
  const buffer = await promisify(zlib.deflate)(string);
  return buffer.toString('base64');
}

/**
 * Decompress a base64-encoded compressed string.
 */
export async function uncompress(string: string): Promise<string> {
  const buffer = Buffer.from(string, 'base64');
  const uint8Array = new Uint8Array(buffer);
  const unzipped = await promisify(zlib.unzip)(uint8Array);
  return unzipped.toString();
}

/**
 * Heuristic: compressed data is base64-encoded (pattern and length).
 */
export function isCompressed(data: string): boolean {
  if (data.length < 20) return false;
  const base64Pattern = /^[A-Za-z0-9+/=]+$/;
  return base64Pattern.test(data) && data.length > 50;
}
