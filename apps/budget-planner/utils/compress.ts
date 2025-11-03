import { promisify } from 'util';
import zlib from 'zlib';

export async function compress(string: string) {
  const buffer = await promisify(zlib.deflate)(string);
  return buffer.toString('base64');
}

export async function uncompress(string: string) {
  const buffer = Buffer.from(string, 'base64');

  const uint8Array = new Uint8Array(buffer);

  const unzipped = await promisify(zlib.unzip)(uint8Array);
  return unzipped.toString();
}
