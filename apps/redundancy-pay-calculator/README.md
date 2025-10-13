# Redundancy Pay Calculator

A calculator tool that helps users determine their statutory redundancy pay entitlement based on their employment history and circumstances.

## Description

This application helps users calculate their statutory redundancy pay entitlement, providing clear information about their rights and expected payments during redundancy situations.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve redundancy-pay-calculator

# Or using nx directly
npx nx serve redundancy-pay-calculator
```

### Build

```bash
# Build for production
npx nx build redundancy-pay-calculator
```

### Testing

```bash
# Run unit tests
npx nx test redundancy-pay-calculator

# Run e2e tests (if available)
npx nx e2e redundancy-pay-calculator-e2e
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

- Statutory redundancy pay calculation
- Employment history input and validation
- Age and service length considerations
- Weekly pay calculations
- Maximum statutory limits application
- Tax implications guidance
- Clear breakdown of calculations
- Educational content about redundancy rights
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Budget Planner](../budget-planner/)
- [Debt Advice Locator](../debt-advice-locator/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
