import { promisify } from 'util';
import zlib from 'zlib';

/**
 * Compress a string using zlib deflate and encode as base64
 * @param string The string to compress
 * @returns Compressed string encoded as base64
 */
export async function compress(string: string): Promise<string> {
  const buffer = await promisify(zlib.deflate)(string);
  return buffer.toString('base64');
}

/**
 * Decompress a base64-encoded compressed string
 * @param string The compressed string encoded as base64
 * @returns Decompressed string
 */
export async function uncompress(string: string): Promise<string> {
  const buffer = Buffer.from(string, 'base64');

  const uint8Array = new Uint8Array(buffer);

  const unzipped = await promisify(zlib.unzip)(uint8Array);
  return unzipped.toString();
}

/**
 * Check if a string appears to be compressed (base64 pattern)
 * This is a heuristic - compressed data is base64 encoded
 */
export function isCompressed(data: string): boolean {
  // Compressed data is base64 encoded, which has a specific pattern
  // Base64 strings are typically longer and contain only A-Z, a-z, 0-9, +, /, =
  // We check if it's a valid base64 string and longer than a threshold
  if (data.length < 20) return false;

  const base64Pattern = /^[A-Za-z0-9+/=]+$/;
  return base64Pattern.test(data) && data.length > 50;
}
