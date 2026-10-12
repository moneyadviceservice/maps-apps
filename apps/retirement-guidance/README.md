# Get Retirement Guidance

The Retirement Guidance Tool is an online service that helps individuals understand their retirement options and make informed decisions about their pension savings. By answering a few questions about their pension arrangements, retirement plans, and future goals, users receive a personalised retirement action plan tailored to their circumstances.

## Description

The tool provides:
• Key information to help users understand their retirement choices.
• Suggested actions to maximise the value of their pension savings.
• Links to useful resources and calculators to estimate retirement income.
• Guidance on next steps, including where to seek further support and advice.
Designed to be simple and easy to use, the Retirement Guidance Tool helps people prepare for retirement with confidence by turning complex pension information into clear, actionable guidance.

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
npm run serve retirement-guidance

# Or using nx directly
npx nx serve retirement-guidance
```

### Build

```bash
# Build for production
npx nx build retirement-guidance
```

### Testing

```bash
# Run unit tests (React Testing Library)
npx nx test retirement-guidance

# Run e2e tests (Playwright)
npm run test:e2e retirement-guidance-e2e

# Run e2e tests on dev environment
npm run test:e2e retirement-guidance-e2e
```

### Lint and typecheck

```bash
npm run lint retirement-guidance
npm run typecheck retirement-guidance
```

## Project Structure

```plaintext
├── assets/             # Static assets, imported within the app
├── components/         # App-specific React components
├── data/               # Static data and content
├── lib/                # Shared app utilities, hooks, etc.
├── pages/              # Next.js pages and routing
├── public/             # Static assets, served at the root
├── eslint.config.mjs   # ESLint configuration
├── netlify.toml        # Netlify configuration
├── next.config.js      # Next.js configuration
├── project.json        # Nx project configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## App-specific Notes

- Default language routing redirects `/` to `/en`.
- CSP headers are configured through app and Netlify configuration (including CSP nonce handling).

## Support

For technical issues or questions about this application, please:

1. Check the main repository README for general setup instructions.
2. Review application logs and test output for errors.
3. Contact the development team through established channels.

---

For general workspace information and setup instructions, see the [main README](../../README.md).
