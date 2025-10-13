# Baby Cost Calculator

A comprehensive tool for estimating the costs associated with having a baby, helping expectant parents plan their finances.

## Description

This application helps users calculate and plan for the various expenses involved in having a baby, from initial costs through the first years of life.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve baby-cost-calculator

# Or using nx directly
npx nx serve baby-cost-calculator
```

### Build

```bash
# Build for production
npx nx build baby-cost-calculator
```

### Testing

```bash
# Run unit tests
npx nx test baby-cost-calculator

# Run e2e tests
npm run test:e2e baby-cost-calculator-e2e
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

- Comprehensive baby cost calculator
- Cost breakdown by category (feeding, clothing, equipment, etc.)
- Timeline-based expense planning
- Comparison tools for different scenarios
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Budget Planner](../budget-planner/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
