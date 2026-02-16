# GitHub Copilot Instructions

This is the MaPS Digital monorepo - a Next.js ecosystem for MoneyHelper financial tools using Nx workspace management.

## Critical Requirements

1. **Next.js Pages Router ONLY** - Never use App Router patterns
2. **JavaScript-free functionality** - Apps must work with JavaScript disabled
3. **Welsh language support** - All apps use `useTranslation` hook for `cy` and `en`
4. **TypeScript strict mode** - Always use proper types, no `any`
5. **Import aliases required** - Use `@maps-react/*` and `@maps-digital/*` from `tsconfig.base.json`

## Architecture Overview

**Monorepo Structure**: 24+ Next.js applications sharing common libraries through Nx workspace.

**Directory Structure**:

- `apps/`: Individual Next.js apps using Pages Router (NOT App Router)
- `libs/shared/`: Reusable libraries
  - `ui`: Common UI components with Storybook
  - `core`: Analytics, Header, Footer components
  - `form`: Form components and validation utilities
  - `hooks`: Custom React hooks
  - `layouts`: Page layout components
  - `utils`: Shared utility functions
- `apps/e2e/`: Centralized E2E tests (Cypress/Playwright)
- `netlify/`: Deployment configurations

## Code Patterns to Follow

### ALWAYS: Import Aliases

```typescript
// CORRECT - Use exact aliases from tsconfig.base.json
import { Button } from '@maps-react/common/components/Button';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

// WRONG - Never use relative imports for shared code
import { Button } from '../../libs/shared/ui/Button';
```

### ALWAYS: Pages Router with Language Routing

```tsx
// CORRECT - pages/[language]/index.tsx
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const language = query.language as string;
  return {
    props: {
      language: language === 'cy' ? 'cy' : 'en',
    },
  };
};

// WRONG - Never use App Router
// app/[language]/page.tsx - DO NOT USE
```

### ALWAYS: Language and Translation Hooks

**useLanguage** - Gets the current language ('en' or 'cy') from the URL:

```tsx
import { useLanguage } from '@maps-react/hooks/useLanguage';

const MyComponent = () => {
  const lang = useLanguage(); // Returns 'en' or 'cy'
  const canonicalUrl = `https://www.moneyhelper.org.uk/${lang}/path`;
};
```

**useTranslation** - Handles all text translations with three methods:

```tsx
import { useTranslation } from '@maps-react/hooks/useTranslation';

const MyComponent = () => {
  const { z, t, tList, locale } = useTranslation();

  return (
    <div>
      {/* Method 1: z() - Inline translations for component-specific text */}
      <h1>{z({ en: 'Budget Planner', cy: 'Cynllunydd Cyllideb' })}</h1>

      {/* With interpolation */}
      <p>{z({ en: 'Hello {name}', cy: 'Helo {name}' }, { name: 'User' })}</p>

      {/* Method 2: t() - Load from /public/locales/[en|cy].json files */}
      <h2>{t('page.title')}</h2>
      <p>{t('page.description', { count: 5 })}</p>

      {/* Method 3: tList() - Get arrays from locale files */}
      {tList('section.items').map((item) => (
        <li>{item}</li>
      ))}

      {/* locale gives current language same as useLanguage() */}
      <span>Current language: {locale}</span>
    </div>
  );
};

// WRONG - Never hardcode text strings
export const BadComponent = () => {
  return <h1>Page Title</h1>; // DO NOT hardcode strings
};
```

**When to use which method:**

- `z()` - For shared components where text should be consistent across all uses
- `t()` - For app-specific text that might be edited by content teams
- `tList()` - For arrays of items in locale files

### ALWAYS: Component Structure

```
ComponentName/
├── ComponentName.tsx         # Component implementation
├── ComponentName.test.tsx    # Unit tests (required)
├── ComponentName.stories.tsx # Storybook stories (for shared UI)
└── index.ts                  # Re-export for cleaner imports
```

### ALWAYS: Tailwind CSS

```javascript
// CORRECT - Extend workspace preset
module.exports = {
  presets: [require('../../tailwind-workspace-preset.js')],
  content: ['./pages/**/*.{js,ts,jsx,tsx}'],
  // app-specific overrides only when needed
};

// WRONG - Never duplicate base configuration
```

## Development Commands

### Starting Development

```bash
# Start a specific app
npm run serve [app-name]

# Component development with Storybook
npm run storybook

# Check which projects are affected by changes
npx nx affected:graph
```

### Testing Commands

```bash
# Unit tests
npm run test:all                    # All unit tests
npm run test [app-name]             # Specific app tests

# E2E tests
npm run test:e2e [app-name]-e2e    # Run E2E for specific app

# Only test affected code (CI optimization)
npm run affected:test
npm run affected:e2e
```

### Code Generation

```bash
# Generate a new component with tests and stories
npx nx generate @maps-react/tools:component --name=MyComponent --project=shared-ui

# Generate for specific app
npx nx generate @maps-react/tools:component --name=MyComponent --project=[app-name]
```

## Configuration Details

### Port Allocation

Each app has a specific port defined in `project.json`:

- Primary app: 4200
- Other apps: 4250, 4300, etc.
- Check `project.json` → serve → options → port

### Environment Variables

```bash
# Copy example and populate with team values
cp .env.example .env.local

# Required variables typically include:
# - API endpoints
# - Analytics keys
# - Feature flags
```

### Build Commands

```bash
# Build single app
npm run build [app-name]

# Build for production
npm run build:production [app-name]

# Build only affected apps (CI optimization)
npm run affected:build

# Lint and type check before building
npm run lint [app-name]
npm run typecheck [app-name]
npm run affected:lint
npm run affected:typecheck
```

### Serve Production Build

```bash
# Serve production build
npm run serve:production [app-name]

# Build and serve production in one go
npm run build:production [app-name] && npm run serve:production [app-name]
```

## CI/CD Pipeline

### Azure DevOps → Netlify

1. **PR Review**: `netlify-pr-review.yml` runs tests and creates preview
2. **Development**: `netlify-dev-on-merge.yml` deploys to dev environment
3. **Production**: Manual deployment via Netlify UI

### Optimization: Nx Affected Commands

Pipeline uses `nx affected` to only build/test changed apps:

- Analyzes git changes
- Builds dependency graph
- Runs only necessary tasks

## Troubleshooting Guide

### Build Failures

```bash
# Clear Nx cache
npx nx reset

# Check configurations
npx nx show project [app-name]

# Verify dependency graph
npx nx graph
```

### Import Errors

```typescript
// Check tsconfig.base.json for correct alias
// Ensure path exists in node_modules or libs/
```

### Test Failures

```bash
# E2E port conflicts - check project.json
# Unit test mocks - verify __mocks__ directory
# Run single test for debugging
npm run test [app-name] --testFile=Component.test.tsx
```

### TypeScript Errors

```typescript
// Never use 'any' - use proper types or 'unknown'
// Enable strict mode in tsconfig.json
// Use type inference where possible
```

## Code Quality Checklist

### Before Committing

- [ ] **Accessibility**: Works with keyboard navigation
- [ ] **Translations**: Welsh language strings added via useTranslation hook
- [ ] **Tests**: Unit tests co-located with components
- [ ] **Types**: No TypeScript errors, no `any` types
- [ ] **Imports**: Using correct `@maps-react/*` aliases
- [ ] **Lint**: `npm run affected:lint` passes
- [ ] **Typecheck**: `npm run affected:typecheck` passes
- [ ] **Build**: `npm run affected:build` succeeds

### Security Requirements

- Never commit `.env.local` or secrets
- Use environment variables for API keys
- Validate all user inputs
- Sanitize data before rendering

## Quick Reference

| Task                   | Command                               |
| ---------------------- | ------------------------------------- |
| Start app (dev)        | `npm run serve [app-name]`            |
| Start app (production) | `npm run serve:production [app-name]` |
| Run tests              | `npm run test [app-name]`             |
| Run E2E                | `npm run test:e2e [app-name]-e2e`     |
| Lint app               | `npm run lint [app-name]`             |
| Typecheck app          | `npm run typecheck [app-name]`        |
| Build app              | `npm run build [app-name]`            |
| Build app (production) | `npm run build:production [app-name]` |
| Lint affected          | `npm run affected:lint`               |
| Typecheck affected     | `npm run affected:typecheck`          |
| Test affected          | `npm run affected:test`               |
| E2E affected           | `npm run affected:e2e`                |

---

**Remember**: This monorepo prioritizes consistency. Always follow established patterns rather than creating new ones. When in doubt, check existing implementations in other apps.
