# Compare Accounts (PACs) 

A comparison tool for Personal Account Claims (PACs) that helps users compare different account options and make informed financial decisions.

## Description

This application allows users to compare various account options, helping them understand the differences and benefits of each to make the best choice for their financial needs.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve compare-accounts

# Or using nx directly
npx nx serve compare-accounts
```

### Build

```bash
# Build for production
npx nx build compare-accounts
```

### Testing

```bash
# Run unit tests
npx nx test compare-accounts

# Run e2e tests (if available)
npx nx e2e compare-accounts-e2e
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

- Account comparison functionality
- Side-by-side feature comparison
- Filtering and sorting options
- Detailed account information
- User-friendly comparison interface
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Credit Options](../credit-options/)
- [Mortgage Calculator](../mortgage-calculator/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
