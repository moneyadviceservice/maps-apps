# Standard Financial Statement 

A comprehensive financial statement tool that helps users create a detailed overview of their income, expenses, and financial commitments.

## Description

This application helps users create a standardized financial statement that provides a complete picture of their financial situation, commonly used for debt management and financial planning purposes.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve standard-financial-statement

# Or using nx directly
npx nx serve standard-financial-statement
```

### Build

```bash
# Build for production
npx nx build standard-financial-statement
```

### Testing

```bash
# Run unit tests
npx nx test standard-financial-statement

# Run e2e tests (if available)
npx nx e2e standard-financial-statement-e2e
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

- Comprehensive income tracking
- Detailed expense categorization
- Debt and commitment recording
- Asset and liability overview
- Monthly budget calculation
- Surplus/deficit analysis
- Printable statement generation
- Data export functionality
- Progress saving and retrieval
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Budget Planner](../budget-planner/)
- [Debt Advice Locator](../debt-advice-locator/)
- [Credit Rejection](../credit-rejection/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
