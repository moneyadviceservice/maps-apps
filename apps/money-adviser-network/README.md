# Money Adviser Network

A directory service that helps users find qualified money advisers and financial guidance services in their local area.

## Description

This application provides a searchable directory of money advisers and financial guidance services, helping users connect with qualified professionals for financial advice and support.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve money-adviser-network

# Or using nx directly
npx nx serve money-adviser-network
```

### Build

```bash
# Build for production
npx nx build money-adviser-network
```

### Testing

```bash
# Run unit tests
npx nx test money-adviser-network

# Run e2e tests (if available)
npx nx e2e money-adviser-network-e2e
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

Required environment variables

- `NEXT_PUBLIC_API_URL` - API endpoint URL
- `NEXT_PUBLIC_ANALYTICS_ID` - Analytics tracking ID
- `NEXT_PUBLIC_MAPS_API_KEY` - Google Maps API key (if using maps)

Additional variables specific to this application (also covered in `.env.example`)

- SESSION_SECRET - a strong secret string 64 characters long
- SESSION_EXPIRY_TIME - in minutes
- SESSION_REFRESH_TIME - in minutes

- APPOINTMENTS_API - telefonica api url (endpoints handled in the code)
- FETCH_APPOINTMENT_SLOTS_CODE - code to fetch appointment slots
- BOOK_APPOINTMENT_SLOT_CODE - code to book appointment slot
- FETCH_BUSINESS_CLOSED_CODE - code to fetch business closed dates
- FETCH_VALIDATE_REFERRER_CODE - code to validate referrer for login

## Features

- Money adviser directory and search
- Location-based adviser finding
- Adviser qualification and specialization filtering
- Contact information and booking systems
- Service area mapping
- Adviser ratings and reviews
- Accessibility information
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Debt Advice Locator](../debt-advice-locator/)
- [MoneyHelper Contact Forms](../moneyhelper-contact-forms/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

## Authentication and Session management

The authentication only requires a valid referral ID. On success a session will be created which is handled within the NextJS app entierly.

There are 2 env variables that establish the session. Firstly, the session length itself:

- SESSION_EXPIRY_TIME: This is responsible for allowing the user access to the application. If it does not exist, or on expiry, the user will be redirected to the login screen.
- SESSION_REFRESH_TIME: This is responsible for maintianing the session validity whilst the user is active. It must be less time than the SESSION_EXPIRY_TIME to work.

The session functionality is handled and explained fully in the middleware. Please refer to this for a detailed explanation.

---

For general workspace information and setup instructions, see the [main README](../../README.md).
