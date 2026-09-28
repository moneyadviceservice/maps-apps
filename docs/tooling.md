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
