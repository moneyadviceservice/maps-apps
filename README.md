# Maps Digital - NX Monorepo

This repository contains the source code for the frontend applications of the Money and Pensions Service (MaPS). This is an [Nx](https://nx.dev) monorepo containing multiple Next.js applications and shared libraries.

## Applications

This repository includes the following applications:

- **Adjustable income calculator** - Tool for calculating adjustable income scenarios
- **Baby cost calculator** - Tool for planning costs for having a baby
- **Baby money timeline** - Timeline of events leading up to the arrival of a baby
- **Budget planner** - Comprehensive budgeting tool for financial planning
- **Cash in chunks** - Pension withdrawal calculator
- **Compare accounts (PACs)** - Tool for comparing different account options
- **Credit options** - Credit comparison and advice tool
- **Credit rejection** - Support for credit rejection scenarios
- **Debt advice locator** - Service to find local debt advice
- **Evidence hub** - Evidence based documentation and reports
- **Guaranteed income estimator** - Pension income estimation tool
- **Leave pot untouched** - Pension pot preservation calculator
- **Midlife MOT** - Financial health check tool
- **Money adviser network** - Directory of financial advisers
- **Moneyhelper contact forms** - Various contact and enquiry forms
- **Moneyhelper tools (deprecated)** - Collection of financial tools and calculators (awaiting decommission)
- **Mortgage affordability** - Mortgage affordability calculator
- **Mortgage calculator** - Mortgage payment calculator
- **Pension type tool** - Tool to find out what type of pension a person has
- **Pensions dashboard (MHPD)** - Unified pensions overview
- **Pensionwise appointment** - Appointment booking system
- **Pensionwise triage** - Pension guidance triage system
- **Redundancy pay calculator** - Calculate redundancy payments
- **Retirement budget planner** - Tool for planning how much you may need in retirement
- **Savings calculator** - Tool to calculate how long/much to save to hit a goal
- **Stamp duty calculator** - Property stamp duty calculator
- **Standard financial statement** - Financial statement tool
- **Take whole pot** - Pension withdrawal calculator
- **Tools index** - Landing page for all tools
- **Workplace pension contribution calculator (WPCC)** - Tool to calculate employer and employee pension contributions

Each application has its own README in its respective directory under `/apps/` with specific setup and usage instructions.

## Getting Started

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- npm

### Installation

1. Clone this repository from Azure DevOps
2. Install dependencies:

   ```bash
   npm install
   ```

### Environment Variables

Each application requires environment variables to run properly, you can either have a root level .env.local file, or an app specific file:

1. Navigate to the specific app directory (e.g., `/apps/budget-planner/`)
2. Copy the `.env.example` file and rename it to `.env.local`
3. Ask an existing team member for the correct values to populate the `.env.local` file

## Detailed Documentation

- [development](/docs/development.md) ( workspaces, vscode, tools )
- [testing](/docs/testing.md) ( unit testing, e2e testing )
- [documenting](/docs/documenting.md) ( storybook )
- [deployment](/docs/deployment.md) ( CI, pipelines )
- [maintenance](/docs/maintenance.md) ( project maintenance )
- [tooling](/docs/tooling.md) ( nx generators )
- [contributing](/docs/contributing.md) ( code standards, general help, committing )
