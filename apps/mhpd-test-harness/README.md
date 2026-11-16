# MHPD Test Harness

This is the MHPD Test Harness app for the Pensions Dashboard.

This app uses the App router (not the Pages router).

The app is an internal tool and is used on lower environments to:

- Choose a test scenario to run the Pensions Dashboard against
- Createe test scenario data
- View existing test scenario data

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate it with the correct environment variables (details of each [listed below](#environment-variables))
- Ask a team member for the specific environment variable values, or find them within Netlify

### Development

```bash
# Start the development server on http://localhost:4304/en
npm run serve mhpd-test-harness

# Or using nx directly
npx nx serve mhpd-test-harness
```

### Build

```bash
# Build for production
npx nx build mhpd-test-harness
```

### Testing

```bash
# Run unit tests
npx nx test mhpd-test-harness

# Lint and type check
npx nx lint mhpd-test-harness
npx nx typecheck mhpd-test-harness

# Run e2e tests
npm run test:e2e mhpd-test-harness-e2e
```

## Project Structure

```text
├── components/         # React components specific to this app
├── pages/              # Next.js pages and routing ([language] holds the en/cy routes)
├── public/             # Static assets, and the copy in locales/en.json and cy.json
├── .env.example        # Environment variables template
├── netlify.toml        # Netlify build and dev configuration
├── next.config.js      # Next.js configuration, including the CSP headers
├── project.json        # NX project configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## Environment Variables

The following environment variables are used within the app:

### Informizely feedback

- `NEXT_PUBLIC_DEV_FEEDBACK_SITE_ID` - Feedback widget site ID

### Cookies and analytics

- `NEXT_PUBLIC_CIVIC_COOKIE_SCRIPT` - Civic cookie script source
- `NEXT_PUBLIC_CIVIC_COOKIE_API_KEY` - Civic cookie API key
- `NEXT_PUBLIC_ADOBE_ANALYTICS_SCRIPT` - Adobe analytics script source

### Build environment

- `NEXT_PUBLIC_ENVIRONMENT` - Production/development/etc. environment

---

For general workspace information and setup instructions, see the [main README](../../README.md).
