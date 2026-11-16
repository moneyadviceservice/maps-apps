# Pensions Dashboard (MHPD)

The MoneyHelper Pensions Dashboard provides a unified view of users' pension information from multiple providers in one secure location.

## Description

This application provides users with a comprehensive overview of their pension pots from different providers, helping them understand their total retirement savings and plan effectively for their future.

## Quick Start

### Prerequisites

**Evironment variables:**

> **Note:** All required environment variables are already configured in the Netlify dashboard for this project.

**Recommended:**
Simply link your local project to the correct Netlify site by running the following command and selecting the app from the dropdown:

```bash
netlify link
```

To unlink

```bash
netlify unlink
```

**If you do NOT have access to Netlify:**
Declare the variables locally using the keys in [.env.example](./.env.example).

Create `apps/pensions-dashboard/.env.local` (source of truth for this app) by copying `.env.example` and filling values:

```bash
cp apps/pensions-dashboard/.env.example apps/pensions-dashboard/.env.local
```

Update the variables with their values obtained from a peer developer or environment owner.

### Development

If using the env vars from Netlify

```bash
   npx nx run pensions-dashboard:serve-netlify
```

This runs `netlify dev --filter pensions-dashboard` via `project.json` and uses `netlify.toml` for local app env loading.

This uses the configuration in `netlify.toml` and ensures your Netlify Functions and environment are available locally.

If you want to pick up env vars from other environments

```bash
  npx netlify dev --filter pensions-dashboard --context branch:test
  npx netlify dev --filter pensions-dashboard --context branch:staging
```

If using env vars locally

# Start the development server

npm run serve pensions-dashboard

# Or using nx directly

npx nx serve pensions-dashboard

The app will be available at [http://localhost:4100](http://localhost:4100).

### Build

```bash
# Build for production
npx nx build pensions-dashboard
```

### Testing

```bash
# Run unit tests
npx nx test pensions-dashboard

# Run e2e tests
npm run test:e2e pensions-dashboard-e2e
```

## Project Structure

```
├── components/         # React components specific to this app
├── data/               # Static data and content
├── pages/              # Next.js pages and routing
├── public/             # Static assets
├── utils/              # Utility functions
├── .env.example        # Environment variables template
├── next.config.js      # Next.js configuration
├── project.json        # NX project configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## Secure Beta Access

When `MHPD_SECURE_BETA_ENABLED` is set, the app uses a Secure Beta Link (SBL) flow: magic link → OTP verification → access token. See [docs/secure-beta-access.md](docs/secure-beta-access.md) for the full process and flow.

## Features

- Unified pension pot overview
- Multi-provider pension aggregation
- Secure authentication and data access
- Pension value tracking and history
- Projection and planning tools
- Provider contact information
- Data export and sharing
- Security and privacy controls
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Security Considerations

This application handles sensitive financial data and implements:

- Multi-factor authentication
- Data encryption in transit and at rest
- Regular security audits
- GDPR compliance
- PCI DSS compliance where applicable

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Guaranteed Income Estimator](../guaranteed-income-estimator/)
- [Leave Pot Untouched](../leave-pot-untouched/)
- [Cash in Chunks](../cash-in-chunks/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
