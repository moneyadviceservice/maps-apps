# Budget Planner 

A comprehensive budgeting tool that helps users plan and manage their personal finances effectively.

## Description

This application provides users with a complete budget planning solution, allowing them to track income, expenses, and savings goals to achieve better financial management.

## Quick Start

### Prerequisites

- Copy `.env.example` to `.env.local` and populate with the correct environment variables
- Ask a team member for the specific environment variable values

### Development

```bash
# Start the development server
npm run serve budget-planner

# Or using nx directly
npx nx serve budget-planner
```

### Build

```bash
# Build for production
npx nx build budget-planner
```

### Testing

```bash
# Run unit tests
npx nx test budget-planner

# Run e2e tests
npm run test:e2e moneyhelper-tools-budget-planner-e2e
```

## Project Structure

```
├── components/         # React components specific to this app
├── context/            # React context providers
├── data/               # Static data and content
├── lib/                # Utility libraries and helpers
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

- Comprehensive budget creation and management
- Income and expense tracking
- Savings goal setting and monitoring
- Financial insights and recommendations
- Data visualization with charts and graphs
- Export functionality for budgets
- Responsive design for mobile and desktop
- Accessibility compliant (WCAG 2.1)

## Related Links

- [MoneyHelper Tools Collection](../moneyhelper-tools/)
- [Adjustable Income Calculator](../adjustable-income-calculator/)
- [Mortgage Affordability Calculator](../mortgage-affordability/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions
2. Review the application logs for error details
3. Contact the development team through the established channels

---

For general workspace information and setup instructions, see the [main README](../../README.md).
