## Testing

### Unit Tests

```bash
# Run all tests
npm run test:all

# Run tests for specific app
npx nx test <app_name>

# Run affected tests only
npx nx affected --target=test
```

### Jest ESM Support for slug

Some dependencies, such as [`slug`](https://github.com/Trott/slug), are distributed as ESM-only modules. By default, Jest does not transform ESM code in `node_modules`, which can cause test failures when importing these packages.

To resolve this, the following configuration has been added to the shared Jest preset (`jest.preset.js`):

```javascript
// jest.preset.js
module.exports = {
  // ...other preset config
  transformIgnorePatterns: [
    // Allow Jest to transform slug ESM
    'node_modules/(?!(slug)/)',
  ],
};
```

This ensures Jest can correctly process ESM code from `slug` and prevents unexpected token errors during test runs.  
All Jest configs in the workspace import this preset, so the change is applied globally.

### End-to-End Tests

**Local Testing:**

```bash
# Pensionwise Triage
npm run test:e2e pensionwise-triage-e2e

# Pensionwise Appointment
npm run test:e2e pensionwise-appointment-e2e

# Pensions Dashboard
npm run test:e2e pensions-dashboard-e2e
```

**Environment Testing:**

```bash
# Test against dev environment
npm run test:e2e pensionwise-triage-e2e -- --baseUrl=https://dev-pwtriage.moneyhelper.org.uk/en/pension-wise-triage/

npm run test:e2e pensionwise-appointment-e2e -- --baseUrl=https://dev-pwappt.moneyhelper.org.uk/en/pension-wise-appointment/
```

**MoneyHelper Tools E2E Tests:**

```bash
npm run test:e2e adjustable-income-calculator-e2e
npm run test:e2e baby-cost-calculator-e2e
npm run test:e2e baby-money-timeline-e2e
npm run test:e2e budget-planner-e2e
npm run test:e2e cash-in-chunks-e2e
npm run test:e2e guaranteed-income-estimator-e2e
npm run test:e2e leave-pot-untouched-e2e
npm run test:e2e moneyhelper-tools-pension-type-e2e
npm run test:e2e moneyhelper-tools-workplace-pension-calculator-e2e
npm run test:e2e pension-type-tool-e2e
npm run test:e2e savings-calculator-e2e
npm run test:e2e take-whole-pot-e2e
npm run test:e2e workplace-pension-calculator-e2e
```
