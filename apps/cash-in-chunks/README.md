# Cash in Chunks 

A pension withdrawal calculator that helps users understand the tax implications and financial impact of taking money from their pension pot in chunks.

## Description

This application provides guidance and calculations for users considering taking partial withdrawals from their pension pot, helping them understand the tax implications and plan their withdrawals effectively.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve cash-in-chunks

# Or using nx directly
npx nx serve cash-in-chunks
```

### Build

```bash
# Build for production
npx nx build cash-in-chunks
```

### Testing

```bash
# Run unit tests
npx nx test cash-in-chunks

# Run e2e tests
npm run test:e2e moneyhelper-tools-cash-in-chunks-e2e
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

- Pension withdrawal calculator
- Tax calculation for partial withdrawals
- Scenario planning and comparison
- Visual representation of withdrawal impact
- Guidance on optimal withdrawal strategies
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Take Whole Pot](../take-whole-pot/)
- [Leave Pot Untouched](../leave-pot-untouched/)
- [Guaranteed Income Estimator](../guaranteed-income-estimator/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
