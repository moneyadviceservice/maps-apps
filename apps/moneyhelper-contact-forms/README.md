# MoneyHelper Contact Forms

A collection of contact and enquiry forms for various MoneyHelper services, enabling users to get in touch with appropriate support teams.

## Description

This application provides a centralized collection of contact forms for different MoneyHelper services, making it easy for users to reach the right team for their specific needs.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve moneyhelper-contact-forms

# Or using nx directly
npx nx serve moneyhelper-contact-forms
```

### Build

```bash
# Build for production
npx nx build moneyhelper-contact-forms
```

### Testing

```bash
# Run unit tests
npx nx test moneyhelper-contact-forms

# Run e2e tests (if available)
npx nx e2e moneyhelper-contact-forms-e2e
```

## Project Structure

```
├── components/         # React components specific to this app
├── guards/             # Form validation and route guards
├── routes/             # Route configuration and schemas
├── store/              # State management
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
- `NEXT_PUBLIC_FORM_SUBMISSION_ENDPOINT` - Form submission API endpoint
- Additional variables specific to this application

## Features

- Multiple contact forms for different services
- Dynamic form routing and validation
- Form submission tracking
- Multi-step form flows
- Data persistence and recovery
- Form validation and error handling
- Confirmation and follow-up processes
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Money Adviser Network](../money-adviser-network/)
- [Debt Advice Locator](../debt-advice-locator/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
