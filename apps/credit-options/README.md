# Credit Options 

A comprehensive tool that helps users understand and explore different credit options available to them based on their financial situation.

## Description

This application provides guidance on various credit options, helping users understand what types of credit might be suitable for their needs and circumstances.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve credit-options

# Or using nx directly
npx nx serve credit-options
```

### Build

```bash
# Build for production
npx nx build credit-options
```

### Testing

```bash
# Run unit tests
npx nx test credit-options

# Run e2e tests (if available)
npx nx e2e credit-options-e2e
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

- Credit option exploration and comparison
- Personalized recommendations based on user input
- Educational content about different credit types
- Risk assessment and suitability checking
- Clear explanations of terms and conditions
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Credit Rejection](../credit-rejection/)
- [Compare Accounts](../compare-accounts/)
- [Debt Advice Locator](../debt-advice-locator/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
