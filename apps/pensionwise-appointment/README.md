# Pensionwise Appointment 

A booking system for Pensionwise guidance appointments, helping users schedule and manage their pension guidance sessions.

## Description

This application provides a comprehensive appointment booking system for Pensionwise guidance sessions, allowing users to find available slots, book appointments, and manage their pension guidance journey.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve pensionwise-appointment

# Or using nx directly
npx nx serve pensionwise-appointment
```

### Build

```bash
# Build for production
npx nx build pensionwise-appointment
```

### Testing

```bash
# Run unit tests
npx nx test pensionwise-appointment

# Run e2e tests locally
npm run test:e2e pensionwise-appointment-e2e

# Run e2e tests on dev environment
npm run test:e2e pensionwise-appointment-e2e -- --baseUrl=https://dev-pwappt.moneyhelper.org.uk/en/pension-wise-appointment/
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
- `NEXT_PUBLIC_BOOKING_API_ENDPOINT` - Appointment booking API
- `NEXT_PUBLIC_CALENDAR_INTEGRATION` - Calendar integration settings
- Additional variables specific to this application

## Features

- Appointment slot availability checking
- Multi-step booking process
- Calendar integration
- Appointment confirmation and reminders
- Rescheduling and cancellation
- Provider location finder
- Accessibility requirements capture
- Multi-language support
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [Pensionwise Triage](../pensionwise-triage/)
- [Pensions Dashboard](../pensions-dashboard/)
- [MoneyHelper Tools Collection](../moneyhelper-tools/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
