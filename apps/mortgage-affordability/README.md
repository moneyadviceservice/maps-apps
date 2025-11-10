# Mortgage Affordability Calculator 

A comprehensive tool that helps users calculate how much they can afford to borrow for a mortgage based on their income, expenses, and financial circumstances.

## Description

This application helps users determine their mortgage affordability by analyzing their income, expenditure, and other financial commitments to provide realistic borrowing estimates.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve mortgage-affordability

# Or using nx directly
npx nx serve mortgage-affordability
```

### Build

```bash
# Build for production
npx nx build mortgage-affordability
```

### Testing

```bash
# Run unit tests
npx nx test mortgage-affordability

# Run e2e tests (if available)
npx nx e2e mortgage-affordability-e2e
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

- Comprehensive affordability calculations
- Income and expenditure analysis
- Debt-to-income ratio calculations
- Stress testing at higher interest rates
- Different mortgage type comparisons
- Visual representation of affordability
- Scenario planning and comparison
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Mortgage Calculator](../mortgage-calculator/)
- [Budget Planner](../budget-planner/)
- [Stamp Duty Calculator](../stamp-duty-calculator/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
