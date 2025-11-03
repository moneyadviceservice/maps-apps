# Take Whole Pot 

A pension planning tool that helps users understand the implications of taking their entire pension pot as a lump sum, including tax consequences and alternative options.

## Description

This application provides guidance and calculations for users considering taking their entire pension pot as a lump sum, helping them understand the tax implications and explore alternative strategies.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve take-whole-pot

# Or using nx directly
npx nx serve take-whole-pot
```

### Build

```bash
# Build for production
npx nx build take-whole-pot
```

### Testing

```bash
# Run unit tests
npx nx test take-whole-pot

# Run e2e tests (if available)
npx nx e2e take-whole-pot-e2e
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

- Whole pot withdrawal calculations
- Tax liability calculations and projections
- 25% tax-free allowance calculations
- Emergency tax rate considerations
- Alternative withdrawal strategy comparisons
- Income impact analysis
- Visual representation of tax implications
- Educational content about pension options
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Cash in Chunks](../cash-in-chunks/)
- [Leave Pot Untouched](../leave-pot-untouched/)
- [Guaranteed Income Estimator](../guaranteed-income-estimator/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
