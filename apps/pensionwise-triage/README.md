# Pensionwise Triage 

A guidance triage system that helps users determine what type of pension guidance or support they need based on their circumstances.

## Description

This application provides an intelligent triage system to help users understand their pension options and determine the most appropriate type of guidance or support for their specific situation.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve pensionwise-triage

# Or using nx directly
npx nx serve pensionwise-triage
```

### Build

```bash
# Build for production
npx nx build pensionwise-triage
```

### Testing

```bash
# Run unit tests
npx nx test pensionwise-triage

# Run e2e tests locally
npm run test:e2e pensionwise-triage-e2e

# Run e2e tests on dev environment
npm run test:e2e pensionwise-triage-e2e -- --baseUrl=https://dev-pwtriage.moneyhelper.org.uk/en/pension-wise-triage/
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

## Environment Variables

Required environment variables (see `.env.example` for full list):

- `NEXT_PUBLIC_API_URL` - API endpoint URL
- `NEXT_PUBLIC_ANALYTICS_ID` - Analytics tracking ID
- `NEXT_PUBLIC_TRIAGE_API_ENDPOINT` - Triage logic API
- Additional variables specific to this application

## Features

- Intelligent question routing
- Personalized guidance recommendations
- Multi-step triage process
- Outcome routing to appropriate services
- Progress saving and resumption
- Accessibility support requirements capture
- Clear explanations of next steps
- Integration with appointment booking
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [Pensionwise Appointment](../pensionwise-appointment/)
- [Pensions Dashboard](../pensions-dashboard/)
- [MoneyHelper Tools Collection](../moneyhelper-tools/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
