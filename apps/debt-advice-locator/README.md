# Debt Advice Locator

A service locator tool that helps users find local debt advice services and support in their area.

## Description

This application helps users locate debt advice services near them, providing essential contact information and guidance for those seeking help with debt management.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve debt-advice-locator

# Or using nx directly
npx nx serve debt-advice-locator
```

### Build

```bash
# Build for production
npx nx build debt-advice-locator
```

### Testing

```bash
# Run unit tests
npx nx test debt-advice-locator

# Run e2e tests (if available)
npx nx e2e debt-advice-locator-e2e
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
- `NEXT_PUBLIC_MAPS_API_KEY` - Google Maps API key (if using maps)
- Additional variables specific to this application

## Features

- Location-based debt advice service search
- Interactive map integration
- Service provider details and contact information
- Filtering by service type and availability
- Distance-based results
- Accessibility information for services
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Credit Rejection](../credit-rejection/)
- [Standard Financial Statement](../standard-financial-statement/)
- [Money Adviser Network](../money-adviser-network/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
