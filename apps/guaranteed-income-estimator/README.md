# Guaranteed Income Estimator

A pension income estimation tool that helps users calculate their potential guaranteed income from pension schemes.

## Description

This application helps users estimate their guaranteed income from various pension sources, providing clarity on their retirement income planning.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve guaranteed-income-estimator

# Or using nx directly
npx nx serve guaranteed-income-estimator
```

### Build

```bash
# Build for production
npx nx build guaranteed-income-estimator
```

### Testing

```bash
# Run unit tests
npx nx test guaranteed-income-estimator

# Run e2e tests
npm run test:e2e moneyhelper-tools-guaranteed-income-estimator-e2e
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
- Additional variables specific to this application

## Features

- Guaranteed income calculation from multiple pension sources
- State pension estimation
- Private pension income calculation
- Workplace pension projections
- Visual income timeline
- Scenario planning and comparison
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Adjustable Income Calculator](../adjustable-income-calculator/)
- [Cash in Chunks](../cash-in-chunks/)
- [Leave Pot Untouched](../leave-pot-untouched/)
- [Pensions Dashboard](../pensions-dashboard/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
