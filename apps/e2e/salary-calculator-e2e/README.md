# Salary Calculator E2E Tests

End-to-end tests for the Salary Calculator application using Playwright.

## Running Tests

### Local Development

Run tests against your local development server (http://localhost:4390):

```bash
npx nx run salary-calculator-e2e:e2e
```

The tests will automatically start the local web server if it's not already running.

### Testing Against Remote Environments

Tests now support running against password-protected remote environments (Netlify dev/staging). Password handling and cookie consent are automated.

#### Using Environment Variables

Set environment variables inline with the command:

```bash
# Against dev environment
BASE_URL=https://develop--maps-salary-calculator.netlify.app/en HTTP_PASSWORD=<ask-team-for-password> npx nx run salary-calculator-e2e:e2e

# Against specific environment with filtered tests
BASE_URL=https://develop--maps-salary-calculator.netlify.app/en HTTP_PASSWORD=<ask-team-for-password> npx nx run salary-calculator-e2e:e2e --grep "£35,000"
```

#### Using .env.local File (Recommended)

For repeated test runs, create a `.env.local` file in the e2e project root:

```bash
# apps/e2e/salary-calculator-e2e/.env.local
BASE_URL=https://develop--maps-salary-calculator.netlify.app/en
HTTP_PASSWORD=JIupXZSLOKa
```

Then run tests normally:

```bash
npx nx run salary-calculator-e2e:e2e
```

**Note:** `.env.local` is gitignored and won't be committed.

## Environment Variables

- **`BASE_URL`** (optional): The URL of the application to test

  - Default: `http://localhost:4390`
  - When set to a remote HTTPS URL, the local web server will not start
  - Examples:
    - `https://develop--maps-salary-calculator.netlify.app/en` (dev environment)
    - `https://staging--maps-salary-calculator.netlify.app/en` (staging, manual deployments only)

- **`HTTP_PASSWORD`** (optional): Password for Netlify-protected environments
  - Default: `dummy-password` (for local development)
  - Required for remote environments protected by Netlify password page
  - Tests automatically detect and handle the password page when present

## Running Specific Tests

You can filter tests using Playwright's `--grep` option:

```bash
# Run only tests matching a specific salary amount
npx nx run salary-calculator-e2e:e2e -- --grep "£35,000"

# Run comparison mode tests
npx nx run salary-calculator-e2e:e2e -- --grep "Compare"
```

## Test Structure

### Single Calculation Tests (6 tests)

These verify calculations for individual salary amounts covering:

- Different frequencies (annual, monthly, weekly, daily, hourly)
- Various tax codes (1257L, BR)
- Pension contributions (percentage and fixed amounts)
- Student loan plans (Plan 1, 2, 4, 5, Postgraduate)
- State pension age and blind person's allowance

**Status:** All passing with full results verification

### Comparison Mode Tests (10 tests)

These test the "Compare two salaries" feature with scenarios like:

- England vs Scotland tax differences
- Different pension contribution rates
- Various student loan plan combinations
- Different tax codes and allowances

**Status:** Tests run but verification is disabled - the comparison results table isn't implemented in the UI yet. The tests fill in both salaries and click calculate, but there's no results breakdown displayed to verify against. Once the feature is built, we've got the test data ready to go.

**Expected when complete:** 16 passing tests

## How It Works

### Cookie Handling

Uses a dual approach to handle cookie consent on both local and remote environments:

1. **API blocking** (local): Mocks the Civic cookie API to return a 400, preventing the banner from showing
2. **DOM manipulation** (remote): Clicks the "Reject marketing cookies" button if the banner appears

```typescript
// In SalaryCalculatorPage.ts
static async disableCookieConsent(page: Page): Promise<void> {
  // First, try to route/block the cookie API endpoint (works for local)
  await page.route('**/c/v**', (route) => {
    return route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: '',
    });
  });

  // Also handle cookie banner if it appears (works for remote environments)
  try {
    const cookieBanner = page.locator('#ccc-notify');
    await cookieBanner.waitFor({ state: 'visible', timeout: 3000 });

    const rejectButton = page.locator('#ccc-notify-reject');
    await rejectButton.click();

    await cookieBanner.waitFor({ state: 'hidden', timeout: 3000 });
  } catch (error) {
    // Cookie banner didn't appear or already handled - continue
  }
}
```

Gets called in `beforeEach` before hitting the page. The dual approach ensures tests work reliably on both local development and remote Netlify environments.

### Path Handling

Tests use `page.goto('/')` not `page.goto('/en')` because BASE_URL already includes the `/en` path. Was causing `/en/en` redirects and timeouts on CI before this was fixed.
