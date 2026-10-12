# App generator (`@maps-react/tools:app`)

Scaffolds a Next.js Pages Router app under `apps/<name>` to the repo
conventions, registers it in the pipeline, PR title, Sonar and editor config
files, and prints the steps that remain manual.

## What it does

1. Validates the request and stops before writing anything if the name is not
   kebab-case or ends in `-e2e`, the project or its folder already exists, the
   Netlify site id is not a UUID, or the port is invalid or already in use.
2. Creates `apps/<name>/project.json` with the standard targets: `build`,
   `serve`, `export`, `test`, `snapshots`, `lint` and `typecheck`.
3. Renders the templates in `files/` into `apps/<name>`.
4. Copies the shared logos, favicons and footer images from
   `libs/shared/ui/src/public` into `apps/<name>/public`, so every app shares
   one source.
5. Runs the `e2e-generate` generator to create `apps/e2e/<name>-e2e`, unless
   `--e2e=false` is passed.
6. Registers the app in the config files listed under
   [Files updated](#files-updated).
7. Formats the result and prints the next steps.

## Usage

Run it from the repo root, because the template folder is resolved relative to
the workspace.

```bash
# Preview the files that would be created and updated
npx nx g @maps-react/tools:app savings-goal --dry-run

# Create apps/savings-goal and apps/e2e/savings-goal-e2e on the next free port
npx nx g @maps-react/tools:app savings-goal

# Pick the port, register the Netlify site id and skip the e2e project
npx nx g @maps-react/tools:app savings-goal --port=4400 --netlifySiteId=<uuid> --e2e=false

# Refresh the project graph afterwards
npx nx reset
```

In Nx Console, select `generate`, then `@maps-react/tools - app`.

## Options

| Option            | Default                    | Description                                                                                                                                                                                                 |
| ----------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`            | required                   | Kebab-case app name, for example `savings-goal`. Becomes the folder `apps/<name>` and the Nx project name. Names ending in `-e2e` are reserved for the e2e projects.                                         |
| `--port`          | lowest free port from 4300 | Dev server port, written to `project.json` and `netlify.toml`. A port counts as used when any project's targets set it or any `apps/*/netlify.toml` has it as `targetPort`. Must be between 1024 and 65535. |
| `--e2e`           | `true`                     | Also generate `apps/e2e/<name>-e2e` and its job in `netlify/templates/test-affected.yml`.                                                                                                                   |
| `--netlifySiteId` | none                       | The Netlify site id (UUID). Without it the three site id registrations are skipped and printed as manual steps.                                                                                             |

The generator also warns when the name overlaps with an existing project name,
because `test-affected.yml` matches app names with `contains()`, so a deploy of
one app could trigger the other's e2e job.

## What is generated

```text
apps/<name>/
├── components/Landing/        # Sample component with a passing test
├── pages/
│   ├── [language]/index.tsx   # The en/cy landing route, switches to the embed layout
│   ├── api/embed.ts           # Embed code endpoint
│   ├── _app.tsx               # BasePageLayout, icons, feedback, analytics and cookie scripts
│   └── _document.tsx
├── public/
│   ├── locales/en.json        # All copy, read with t() from @maps-react/hooks/useTranslation
│   ├── locales/cy.json
│   ├── iframeResizer*.js      # Embed support
│   └── ...                    # Logos, favicons and footer images from libs/shared/ui/src/public
├── .env.example
├── eslint.config.mjs
├── index.d.ts
├── jest.config.ts
├── netlify.toml               # Build ignore rule, CSP nonce plugin, dev command and port
├── next.config.js             # CSP headers, / to /en redirect, @maps-public alias, SVGR
├── postcss.config.js
├── project.json
├── README.md
├── tailwind.config.js         # Workspace preset, content globs limited to pages and components
├── tsconfig.json
└── tsconfig.spec.json
```

The app serves `/en` and `/cy`, redirects `/` to `/en`, and renders the embed
layout when `isEmbedded=true` is in the query string. All copy, including the
page title, lives in the locale JSON files.

## Files updated

Always:

- `netlify/scripts/validate-pr-title.py`: `VALID_SCOPES["Apps"]`
- `netlify/netlify-azure-pipelines.yml`, `netlify-branch-deploy.yml`,
  `netlify-branch-env-unset.yml`, `netlify-restore-env-vars.yml`,
  `netlify-redeploy-published.yml` and `netlify-relink.yml`: the app name
  parameter lists
- `sonarqube/sonar-project.properties`: `sonar.exclusions`,
  `sonar.tests.inclusions` and `sonar.coverage.exclusions`
- `.vscode/settings.json`: `conventionalCommits.scopes`

With `--e2e` (the default):

- `netlify/templates/test-affected.yml`: a `test_<name>_if_affected` job and
  its entry under `dependsOn` of `post_collated_playwright_reports`

With `--netlifySiteId`:

- `netlify/templates/match-site.yml`: a `"<name>")` case
- `netlify/scripts/sites.py`: `SITES`
- `netlify/scripts/get-site-id.sh`: `SITE_IDS`

Every edit is idempotent, and sorted lists keep their order. When a file or the
anchor line it inserts at is missing, the generator warns, adds the edit to the
printed next steps and carries on.

## After generating

The generator prints a numbered list of next steps. In short:

1. Run `npx nx reset`, because the project graph has changed.
2. Copy `apps/<name>/.env.example` to `.env.local` and fill in the values.
3. Run `npx nx serve <name>` and check `/en`, `/cy` and `/en?isEmbedded=true`.
4. Create the Netlify site with base directory `apps/<name>`, set
   `PROJECT_NAME=<name>` on it and add its environment variables. Register its
   site id in the three files above if you did not pass `--netlifySiteId`.
5. The `match-site.yml` case assumes the Netlify site is named after the app.
   If it is not, change `NETLIFY_ENV_FILTER` in that case.
6. Optionally list the tool in `apps/tools-index/data/tools-index-data.ts`.

## Maintaining the generator

- `generator.ts` orchestrates the run. `utils.ts` holds validation, port
  selection, the project configuration, asset copying and the next steps text.
  `registrations.ts` holds one function per config file edit and the
  `registerApp` table that applies them.
- Templates in `files/` are EJS. The `__tmpl__` suffix is stripped on output
  and `__dot__` becomes `.`, so `__dot__env.example__tmpl__` is written as
  `.env.example`. Keep the suffix on every template, because without it the
  project graph and lint treat the templates as source files. The available
  variables are `name`, `className`, `propertyName`, `constantName` and
  `fileName` from `names()`, plus `title` and `port`.
- To ship another shared asset, add its path to `SHARED_PUBLIC_ASSETS` in
  `utils.ts` rather than copying the file into `files/`.
- `npx nx test shared-tools` runs the unit tests. `generator.test.ts` and
  `registrations.test.ts` load the real registry files from disk, so a format
  change in any of them fails the tests and names the anchor to update in
  `registrations.ts`.
- `npx nx build shared-tools` is the only check that compiles the library under
  its own build config, so run it as well as the tests.
- For a full check, dry run, then generate a throwaway app, run
  `npx nx reset`, then `npx nx run-many -t typecheck lint test build -p example-tool`
  and `npx nx serve example-tool`. Clean up with:

```bash
git checkout -- netlify sonarqube .vscode
rm -rf apps/example-tool apps/e2e/example-tool-e2e dist/apps/example-tool
npx nx reset
```
