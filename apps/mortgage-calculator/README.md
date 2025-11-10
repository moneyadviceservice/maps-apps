# Mortgage Calculator 

A comprehensive mortgage payment calculator that helps users calculate monthly payments, total interest, and compare different mortgage scenarios.

## Description

This application provides detailed mortgage payment calculations, helping users understand the financial implications of different mortgage options and terms.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve mortgage-calculator

# Or using nx directly
npx nx serve mortgage-calculator
```

### Build

```bash
# Build for production
npx nx build mortgage-calculator
```

### Testing

```bash
# Run unit tests
npx nx test mortgage-calculator

# Run e2e tests (if available)
npx nx e2e mortgage-calculator-e2e
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

- Monthly payment calculations
- Total interest calculations
- Amortization schedule
- Overpayment impact analysis
- Interest rate comparison
- Different mortgage term comparisons
- Visual payment breakdown
- Export and sharing functionality
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Mortgage Affordability Calculator](../mortgage-affordability/)
- [Stamp Duty Calculator](../stamp-duty-calculator/)
- [Budget Planner](../budget-planner/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
