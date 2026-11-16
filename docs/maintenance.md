## Workspace Maintenance

### NX Migration

```bash
# Create migrations file for latest version
npm nx migrate latest

# Or migrate to specific version
npm nx migrate [version]

# Run the migrations
npm nx migrate --run-migrations

# Install updated dependencies
npm install
```

**Post-Migration Testing:**

- Run unit tests
- Run E2E tests
- Test component generation with `nx generate`
- Test apps in local environment
- Build and test all applications

### Local MoneyHelper Build

```bash
# Build the project
npx nx build moneyhelper-tools

# Navigate to build directory
cd dist/apps/moneyhelper-tools

# Run the build
npm start
```
