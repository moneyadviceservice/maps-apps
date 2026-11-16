# Salary Calculator E2E Test Maintenance

UK tax rates change every April. When that happens, these tests fail - that's expected.

## Annual Update (April)

**1. Check devs updated the calculation code first**
Look at `apps/salary-calculator/utils/rates/` for commits around late March/early April. Don't touch test data until calc logic is updated.

**2. Verify against HMRC**
Use https://www.tax.service.gov.uk/estimate-paye-take-home-pay/your-pay

Save screenshots in `test-evidence/tax-year-[YEAR]/` for audit.

**3. Update test data**

`salCalcTestInputs.ts` (6 tests):
- £35k annual (England) - pension, student loan, state pension, blind allowance
- £5k monthly (England)
- £890 weekly (Scotland)
- £123 daily (Scotland, 5 days/week)
- £25 hourly (Scotland, 35 hours/week)
- £28k annual (England) - state pension age, no NI

`salCalcComparisonInputs.ts` (10 tests):
1. £35k England vs Scotland
2. £40k (5% pension) vs £50k (10% pension)
3. £30k annual vs £2.5k monthly
4. £45k Plan 1 vs Plan 2 loans
5. £25/hr Scotland vs £46k England
6. £32k no pension vs 8% pension
7. £800 weekly vs £160 daily
8. £38k tax code 1257L vs BR
9. £45k (Plan 1 + PG) vs £45k (Plan 4 + 5) - manual calc
10. £105k vs £155k (over 66 + blind) - manual calc

For 1-8: Run through HMRC, screenshot, update monthly net values.
For 9-10: HMRC doesn't support these combos - use manual calcs verified by devs.

Update file headers with new tax year.

**4. Run tests**
```bash
npx nx run salary-calculator:serve
npx nx run salary-calculator-e2e:e2e
```
Should see 16 passing.

**5. PR with checklist**
`test: Update E2E tests for Tax Year [YEAR]`

- [ ] Calc logic updated by devs
- [ ] All 16 tests verified
- [ ] Tests passing locally
- [ ] Screenshots saved
- [ ] File headers updated

## Quick notes

- Use exact HMRC values. Small diffs (like £0.10) are usually rounding - use HMRC's number and mention to devs.
- Only update DATA files. Don't touch page objects or specs unless selectors changed.
- State Pension and Blind Person elements use `id` with `salary2_` prefix instead of `data-testid` with `-2` suffix (see SalaryCalculatorPage.ts:144, 167).

## If tests fail

- Double-check you updated monthly net salary, not annual
- Review your screenshots
- If values still off, ask someone to verify your HMRC screenshots
