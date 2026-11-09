export interface Cookie {
  name: string;
  value: string;
}

/**
 * Parses a Set-Cookie header string into key/value cookie pairs.
 */
export class CookieUtils {
  static parseCookies(header: string): Cookie[] {
    return header
      .split('\n')
      .map((cookieStr) => cookieStr.split(';', 1)[0]) // only the "key=value"
      .map((kv) => {
        const [name, value] = kv.split('=');
        return {
          name: name?.trim(),
          value: value?.trim() ?? '',
        } as Cookie;
      })
      .filter((c) => c.name); // remove empties
  }
}
