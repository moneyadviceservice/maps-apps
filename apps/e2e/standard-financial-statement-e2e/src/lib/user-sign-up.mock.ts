import type { Page, Route } from '@playwright/test';

/**
 * Mocks the user sign-up API used during apply-to-use Part 2 and OTP flows.
 */
export async function mockUserSignUpApi(page: Page): Promise<void> {
  await page.route('**/api/user-sign-up', async (route: Route, request) => {
    const postData = request.postDataJSON?.();

    if (!postData?.otp) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          continuation_token: 'mocked-continuation-token',
        }),
      });
    }

    if (postData.otp === '123456') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'User signed up successfully id token',
          success: true,
          id_token: 'mocked-id-token',
        }),
      });
    }

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        name: 'otp',
        error: 'invalid_grant',
      }),
    });
  });
}
