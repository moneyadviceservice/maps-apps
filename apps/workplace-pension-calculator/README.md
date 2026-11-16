# Workplace Pension Calculator

A pension planning tool that helps users understand how much is paid into their workplace pension by themselves and their employer.

## Description

This application provides guidance and calculations for users who want to estimate workplace pension contributions, including employee contributions, employer contributions, and tax relief.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables (details of each [listed below](#environment-variables))
- Ask a team member for the specific environment variable values, or find the relevant values within Netlify

### Development

```bash
# Start the development server
npm run serve workplace-pension-calculator

# Or using nx directly
npx nx serve workplace-pension-calculator
```

### Build

```bash
# Build for production
npx nx build workplace-pension-calculator
```

### Testing

```bash
# Run unit tests
npx nx test workplace-pension-calculator

# Run e2e tests
npm run test:e2e workplace-pension-calculator-e2e
```

## Project Structure

```text
├── components/         # React components specific to this app
├── data/               # Static data and content
├── pages/              # Next.js pages and routing
├── public/             # Static assets
├── types/              # App-specific TypeScript types
├── utils/              # Utility functions
├── .env.example        # Environment variables template
├── next.config.js      # Next.js configuration
├── project.json        # NX project configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## Environment Variables

The following environment variables are used within the app:

### Informizely feedback

- `NEXT_PUBLIC_DEV_FEEDBACK_SITE_ID` - Feedback widget site ID

### Contact Us widget

- `NEXT_PUBLIC_CONTACT_US_WIDGET_SRC` - Contact widget script source
- `NEXT_PUBLIC_CONTACT_US_WIDGET_DEPLOYMENT_ID_EN` - English deployment ID for contact widget
- `NEXT_PUBLIC_CONTACT_US_WIDGET_DEPLOYMENT_ID_CY` - Welsh deployment ID for contact widget

### Cookies and analytics

- `NEXT_PUBLIC_CIVIC_COOKIE_SCRIPT` - Civic cookie script source
- `NEXT_PUBLIC_CIVIC_COOKIE_API_KEY` - Civic cookie API key
- `NEXT_PUBLIC_ADOBE_ANALYTICS_SCRIPT` - Adobe analytics script source

### Build environment

- `NEXT_PUBLIC_ENVIRONMENT` - Production/development/etc. environment

## Features

- Workplace pension contribution calculations
- Employee and employer contribution breakdown
- Tax relief calculations
- Contribution frequency controls (yearly, monthly, 4-weekly, weekly)
- Step-by-step calculator journey with validation
- Results sharing (print and email)
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [Tools Index](../tools-index/)
- [Individual tool apps in the workspace](../)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
