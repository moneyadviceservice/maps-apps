# MoneyHelper Tools

A comprehensive collection of financial tools and calculators that help users make informed decisions about their money and financial planning.

## Description

This application serves as the main hub for MoneyHelper's suite of financial tools, providing access to various calculators and planning tools in a unified interface.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve moneyhelper-tools

# Or using nx directly
npx nx serve moneyhelper-tools
```

### Build

```bash
# Build for production
npx nx build moneyhelper-tools

# Run local build for testing
cd dist/apps/moneyhelper-tools
npm start
```

### Testing

```bash
# Run unit tests
npx nx test moneyhelper-tools

# Run specific e2e tests
npm run test:e2e moneyhelper-tools-adjustable-income-e2e
npm run test:e2e moneyhelper-tools-baby-cost-calculator-e2e
npm run test:e2e moneyhelper-tools-budget-planner-e2e
npm run test:e2e moneyhelper-tools-cash-in-chunks-e2e
npm run test:e2e moneyhelper-tools-guaranteed-income-estimator-e2e
npm run test:e2e moneyhelper-tools-pension-type-e2e
npm run test:e2e moneyhelper-tools-pot-estimator-e2e
npm run test:e2e moneyhelper-tools-pot-untouched-e2e
npm run test:e2e moneyhelper-tools-savings-calculator-e2e
npm run test:e2e moneyhelper-tools-workplace-pension-calculator-e2e
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

- Centralized access to all MoneyHelper financial tools
- Tool discovery and navigation
- Integrated user experience across tools
- Tool usage analytics and tracking
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Included Tools

This application provides access to various financial planning tools including:

- Budget Planner
- Adjustable Income Calculator
- Baby Cost Calculator
- Cash in Chunks Calculator
- Guaranteed Income Estimator
- Pension Type Tool
- Pot Estimator
- Savings Calculator
- Workplace Pension Calculator
- And more...

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
