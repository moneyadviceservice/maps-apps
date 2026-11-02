# Retirement Budget Planner

A budget planning tool that helps users estimate if their retirement income will cover all of their essential costs.

## Description

This application provides users with a budget planning solution, allowing them to calculate their estimated retirement income (based on a combination of State Pension and private/workplace pensions), their likely costs after they retire (such as bills, rent, and travel), and the leftover balance of the two.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (see [.nvmrc](../../.nvmrc) in the repo for the required version)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)
- [Nx CLI](https://nx.dev/getting-started/intro) (recommended for monorepo management)

  ```bash
  npm install -g nx@latest
  ```

### Initialise environment

- Copy `.env.example` to `.env.local` and populate with environment values (details of each [listed below](#environment-variables))
- Ask a team member for the specific environment variable values, or find the relevant values within Netlify

### Development

```bash
# Start the development server
npm run serve retirement-budget-planner

# Or using nx directly
npx nx serve retirement-budget-planner
```

### Build

```bash
# Build for production
npx nx build retirement-budget-planner
```

### Testing

```bash
# Run unit tests (React Testing Library)
npx nx test retirement-budget-planner

# Run e2e tests (Playwright)
npm run test:e2e retirement-budget-planner-e2e

# Run e2e tests on dev environment
npm run test:e2e pensionwise-appointment-e2e -- --baseUrl=https://develop--retirement-budget-planner.netlify.app/
```

### Lint and typecheck

```bash
npm run lint retirement-budget-planner
npm run typecheck retirement-budget-planner
```

## Project Structure

```plaintext
├── assets/             # Static assets, imported within the app
├── components/         # App-specific React components
├── context/            # React context providers/state
├── data/               # Static data and content
├── layout/             # Layout patterns
├── lib/                # Shared app utilities, hooks, etc.
├── pages/              # Next.js pages and routing
├── public/             # Static assets, served at the root
├── services/           # App services and integrations
├── .env.example        # Environment variables template
├── eslint.config.mjs   # ESLint configuration
├── netlify.toml        # Netlify configuration
├── next.config.js      # Next.js configuration
├── project.json        # Nx project configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## Environment Variables

The following environment variables values are used within the app:

### Redis/session

- `AZURE_REDIS_CONNECTION_STRING`
- `AZURE_MANAGED_REDIS_CONNECT_VIA_KEY`

### Cosmos DB (save-and-return persistence)

- `COSMOS_DB_CONECTION_STRING`
- `COSMOS_DB_DATABASE_ID`
- `COSMOS_DB_CONTAINER_ID`

### GOV.UK Notify (save-and-return emails)

- `NOTIFY_API_KEY`
- `NOTIFY_TEMPLATE_ID_EN`
- `NOTIFY_TEMPLATE_ID_CY`

### Informizely feedback and Adobe Analytics

- `NEXT_PUBLIC_DEV_FEEDBACK_SITE_ID`
- `NEXT_PUBLIC_ADOBE_ANALYTICS_SCRIPT`

## App-specific Notes

- Default language routing redirects `/` to `/en`.
- CSP headers are configured through app and Netlify configuration (including CSP nonce handling).
- Save-and-return flows require Redis, Cosmos DB, and Notify credentials.

## Related Links

- [Retirement Budget Planner e2e](../e2e/retirement-budget-planner-e2e/)

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions.
2. Review application logs and test output for errors.
3. Contact the development team through established channels.

---

For general workspace information and setup instructions, see the [main README](../../README.md).
