# Tools Index 

A landing page and navigation hub that provides easy access to all MoneyHelper financial tools and calculators.

## Description

This application serves as the main entry point and navigation hub for all MoneyHelper financial tools, helping users discover and access the right tools for their financial planning needs.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve tools-index

# Or using nx directly
npx nx serve tools-index
```

### Build

```bash
# Build for production
npx nx build tools-index
```

### Testing

```bash
# Run unit tests
npx nx test tools-index

# Run e2e tests (if available)
npx nx e2e tools-index-e2e
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

- Comprehensive tool directory
- Categorized tool navigation
- Search and filter functionality
- Tool descriptions and previews
- Popular and recommended tools
- Usage analytics and tracking
- Responsive grid layout
- Quick access to frequently used tools
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Available Tools

This index provides access to:

- **Budgeting & Planning**: Budget Planner, Midlife MOT
- **Pensions**: Guaranteed Income Estimator, Cash in Chunks, Leave Pot Untouched, Take Whole Pot
- **Property**: Mortgage Calculator, Mortgage Affordability, Stamp Duty Calculator
- **Debt & Credit**: Credit Options, Credit Rejection, Debt Advice Locator, Standard Financial Statement
- **Life Events**: Baby Cost Calculator, Redundancy Pay Calculator
- **Savings & Investments**: Various savings calculators
- **Professional Services**: Money Adviser Network, Contact Forms

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Individual tool applications](../)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
