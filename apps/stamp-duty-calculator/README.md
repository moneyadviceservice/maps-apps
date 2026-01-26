# Stamp Duty Calculator 

A comprehensive calculator for Stamp Duty Land Tax (SDLT) that helps users calculate the tax due on property purchases in England and Northern Ireland.

## Description

This application calculates Stamp Duty Land Tax (SDLT) based on property purchase price, buyer circumstances, and property type, providing accurate tax calculations for property transactions.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve stamp-duty-calculator

# Or using nx directly
npx nx serve stamp-duty-calculator
```

Once the server is running, you can access the calculators at:

- **SDLT (Stamp Duty Land Tax)**: <http://localhost:4396/en/sdlt>
- **LTT (Land Transaction Tax)**: <http://localhost:4396/en/ltt>
- **LBTT (Land & Buildings Transaction Tax)**: <http://localhost:4396/en/lbtt>

### Build

```bash
# Build for production
npx nx build stamp-duty-calculator
```

### Testing

```bash
# Run unit tests
npx nx test stamp-duty-calculator

# Run e2e tests (if available)
npx nx e2e stamp-duty-calculator-e2e
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

- SDLT calculation for all property types
- First-time buyer relief calculations
- Additional property surcharge calculations
- Multiple property purchase scenarios
- Corporate entity SDLT calculations
- Historical rate comparisons
- Clear breakdown of tax bands and rates
- Savings calculations for different scenarios
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Mortgage Calculator](../mortgage-calculator/)
- [Mortgage Affordability Calculator](../mortgage-affordability/)
- [Budget Planner](../budget-planner/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
