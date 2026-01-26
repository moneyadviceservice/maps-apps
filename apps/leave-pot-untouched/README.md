# Leave Pot Untouched 

A pension planning tool that helps users understand the implications and benefits of leaving their pension pot untouched until later in retirement.

## Description

This application provides guidance and calculations for users considering leaving their pension pot untouched, helping them understand growth potential and withdrawal strategies.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve leave-pot-untouched

# Or using nx directly
npx nx serve leave-pot-untouched
```

### Build

```bash
# Build for production
npx nx build leave-pot-untouched
```

### Testing

```bash
# Run unit tests
npx nx test leave-pot-untouched

# Run e2e tests
npm run test:e2e moneyhelper-tools-pot-untouched-e2e
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

- Pension pot growth projections
- Compound interest calculations
- Withdrawal strategy planning
- Timeline visualization
- Risk assessment
- Scenario comparison tools
- Educational content about pension preservation
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Cash in Chunks](../cash-in-chunks/)
- [Take Whole Pot](../take-whole-pot/)
- [Guaranteed Income Estimator](../guaranteed-income-estimator/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
