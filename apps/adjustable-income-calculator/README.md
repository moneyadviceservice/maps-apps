# Adjustable Income Calculator

A financia## Project Structure

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
```ol that helps users calculate and visualize adjustable income scenarios for retirement planning.

## Description

This application provides users with the ability to model different income adjustment scenarios, helping them understand how changes in their financial situation might affect their retirement income.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve adjustable-income-calculator

# Or using nx directly
npx nx serve adjustable-income-calculator
```

### Build

```bash
# Build for production
npx nx build adjustable-income-calculator
```

### Testing

```bash
# Run unit tests
npx nx test adjustable-income-calculator

# Run e2e tests
npm run test:e2e moneyhelper-tools-adjustable-income-e2e
```

## Project Structure

```
├── components/         # React components specific to this app
├── data/              # Static data and content
├── pages/             # Next.js pages and routing
├── public/            # Static assets
├── utils/             # Utility functions
├── .env.example       # Environment variables template
├── next.config.js     # Next.js configuration
├── project.json       # NX project configuration
└── tailwind.config.js # Tailwind CSS configuration
```

## Environment Variables

Required environment variables (see `.env.example` for full list):

- `NEXT_PUBLIC_API_URL` - API endpoint URL
- `NEXT_PUBLIC_ANALYTICS_ID` - Analytics tracking ID
- Additional variables specific to this application

## Features

- Interactive income adjustment calculator
- Scenario comparison tools
- Visual charts and graphs
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Budget Planner](../budget-planner/)
- [Guaranteed Income Estimator](../guaranteed-income-estimator/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
