# Pensions Dashboard (MHPD) 

The MoneyHelper Pensions Dashboard provides a unified view of users' pension information from multiple providers in one secure location.

## Description

This application provides users with a comprehensive overview of their pension pots from different providers, helping them understand their total retirement savings and plan effectively for their future.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve pensions-dashboard

# Or using nx directly
npx nx serve pensions-dashboard
```

### Build

```bash
# Build for production
npx nx build pensions-dashboard
```

### Testing

```bash
# Run unit tests
npx nx test pensions-dashboard

# Run e2e tests
npm run test:e2e pensions-dashboard-e2e
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
- `NEXT_PUBLIC_PENSION_API_ENDPOINT` - Pension data API endpoint
- `NEXT_PUBLIC_AUTH_PROVIDER` - Authentication provider configuration
- Additional variables specific to this application

## Features

- Unified pension pot overview
- Multi-provider pension aggregation
- Secure authentication and data access
- Pension value tracking and history
- Projection and planning tools
- Provider contact information
- Data export and sharing
- Security and privacy controls
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Security Considerations

This application handles sensitive financial data and implements:

- Multi-factor authentication
- Data encryption in transit and at rest
- Regular security audits
- GDPR compliance
- PCI DSS compliance where applicable

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Guaranteed Income Estimator](../guaranteed-income-estimator/)
- [Leave Pot Untouched](../leave-pot-untouched/)
- [Cash in Chunks](../cash-in-chunks/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
