## Development Tools & Component Generation

### Generate UI Components

There is a custom generator that creates components following the [Frontend Best Practices](https://dev.azure.com.mcas.ms/moneyandpensionsservice/MaPS%20Digital/_wiki/wikis/MaPS-Digital.wiki/266/Frontend-Best-Practices):

**Via NX Console (Recommended):**

- Select `generate` → `@maps-react/tools - component`

**Via CLI:**

```bash
npm nx generate @maps-react/tools:component
```

**Generated Structure:**

```bash
└── libs/shared/ui/src/components
  └── ComponentName
    ├── ComponentName.stories.tsx
    ├── ComponentName.test.tsx
    ├── ComponentName.tsx
    └── index.ts
```

Use `targetPath` option to create components in specific directories (e.g., `apps/pensionwise-triage/components`).

### Generate an Application

The `app` generator scaffolds a Next.js Pages Router app to the repo conventions and registers it in the Netlify pipeline lists, the PR title scopes, the Sonar config and the VS Code commit scopes, then prints the steps that remain manual (creating the Netlify site, adding its environment variables and site id, listing the tool on tools-index).

**Via NX Console:**

- Select `generate` → `@maps-react/tools - app`

**Via CLI:**

```bash
# Preview first
npx nx g @maps-react/tools:app example-app --dry-run

# Generate, then refresh the project graph
npx nx g @maps-react/tools:app example-app
npx nx reset
```

**Options:**

- `--port=4400`: dev server port, written to `project.json` and `netlify.toml`. Defaults to the lowest port from 4300 that no other project uses.
- `--e2e=false`: skip the Playwright e2e project (default is to call the `e2e-generate` generator).
- `--netlifySiteId=<uuid>`: register the Netlify site id in `match-site.yml`, `sites.py` and `get-site-id.sh`.

The generator fails before writing anything if the name is not kebab-case, the project or folder already exists, or the requested port is in use.

The [app generator README](../libs/shared/tools/src/generators/app/README.md) lists what is generated, the files it updates and how to maintain the templates.
