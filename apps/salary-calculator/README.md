# Salary Calculator

A comprehensive salary calculation tool that helps users understand their net income, tax deductions, and take-home pay based on their gross salary.

## Description

This application provides detailed salary calculations, helping users understand the financial breakdown of their income including taxes, National Insurance contributions, and other deductions.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve salary-calculator

# Or using nx directly
npx nx serve salary-calculator
```

### Build

```bash
# Build for production
npx nx build salary-calculator
```

### Testing

```bash
# Run unit tests
npx nx test salary-calculator

# Run e2e tests (if available)
npx nx e2e salary-calculator-e2e
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

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Budget Planner](../budget-planner/)
- [Retirement Budget Planner](../retirement-budget-planner/)
- [Redundancy Pay Calculator](../redundancy-pay-calculator/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
