import type { ExpectMatcherState } from '@lib/test.lib';

interface MatcherOptions<TExpected, TReceived> {
  matcherName: string;
  pass: boolean;
  expected: TExpected;
  received: TReceived;
  utils: ExpectMatcherState['utils'];
}

interface PollMatcherOptions {
  timeout?: number;
  interval?: number;
}

/**
 * Polls a matcher callback until it passes or the timeout is reached.
 *
 * @example
 * const result = await pollMatcherResult(async () => ({
 *   pass: await page.locator('text=Loaded').isVisible(),
 *   expected: true,
 *   received: false,
 * }));
 */
export async function pollMatcherResult<TExpected, TReceived>(
  matcher: () => Promise<{
    pass: boolean;
    expected: TExpected;
    received: TReceived;
  }>,
  options: PollMatcherOptions = {},
) {
  const timeout = options.timeout ?? 5000;
  const interval = options.interval ?? 100;
  const deadline = Date.now() + timeout;

  let lastResult = await matcher();
  while (!lastResult.pass && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, interval));
    lastResult = await matcher();
  }

  return lastResult;
}

/**
 * Builds a Playwright-style matcher result object with a readable failure message.
 *
 * @example
 * const expected = "text"
 * const received = "text"
 *
 * return createMatcherResult({
 *   matcherName: 'page to have expected title',
 *   pass: expected === received,
 *   expected: 'Welcome',
 *   received: 'Welcome',
 *   utils,
 * });
 */
export function createMatcherResult<TExpected, TReceived>({
  matcherName,
  pass,
  expected,
  received,
  utils,
}: MatcherOptions<TExpected, TReceived>) {
  return {
    pass,
    message: () => {
      const header = `Expected ${pass ? 'NOT ' : ''}${matcherName}`;

      return `${header}
Expected: ${utils.printExpected(expected)}
Received: ${utils.printReceived(received)}`;
    },
  };
}
