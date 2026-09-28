# Credit Rejection 

A support tool that provides guidance and next steps for users who have been rejected for credit applications.

## Description

This application helps users understand why they might have been rejected for credit and provides practical advice and alternative options for their financial needs.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve credit-rejection

# Or using nx directly
npx nx serve credit-rejection
```

### Build

```bash
# Build for production
npx nx build credit-rejection
```

### Testing

```bash
# Run unit tests
npx nx test credit-rejection

# Run e2e tests (if available)
npx nx e2e credit-rejection-e2e
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

- Credit rejection guidance and support
- Explanation of common rejection reasons
- Steps to improve credit score
- Alternative financial options
- Action plan creation
- Educational resources
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Credit Options](../credit-options/)
- [Debt Advice Locator](../debt-advice-locator/)
- [Standard Financial Statement](../standard-financial-statement/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
