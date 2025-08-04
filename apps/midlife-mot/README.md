# Midlife MOT

A comprehensive financial health check tool designed for people in their 40s and 50s to assess their financial wellbeing and retirement preparedness.

## Description

This application provides a comprehensive financial health check, helping users assess their current financial situation and plan for their future, particularly focusing on midlife financial planning needs.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve midlife-mot

# Or using nx directly
npx nx serve midlife-mot
```

### Build

```bash
# Build for production
npx nx build midlife-mot
```

### Testing

```bash
# Run unit tests
npx nx test midlife-mot

# Run e2e tests (if available)
npx nx e2e midlife-mot-e2e
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

- Comprehensive financial health assessment
- Retirement readiness evaluation
- Pension contribution optimization
- Debt management guidance
- Savings goal tracking
- Insurance needs analysis
- Personalized action plans
- Progress tracking and monitoring
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Budget Planner](../budget-planner/)
- [Guaranteed Income Estimator](../guaranteed-income-estimator/)
- [Pensions Dashboard](../pensions-dashboard/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
