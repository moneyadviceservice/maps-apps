import React from 'react';

import { SalaryFormData } from 'components/SalaryForm';

/**
 * Renders hidden inputs for salary2 data to preserve values when switching back to single mode.
 */
export const Salary2Data: React.FC<{ salary2Data: SalaryFormData }> = ({
  salary2Data,
}) => (
  <>
    <input
      type="hidden"
      name="salary2_grossIncome"
      value={salary2Data.grossIncome}
    />
    <input
      type="hidden"
      name="salary2_grossIncomeFrequency"
      value={salary2Data.grossIncomeFrequency}
    />
    <input
      type="hidden"
      name="salary2_hoursPerWeek"
      value={salary2Data.hoursPerWeek}
    />
    <input
      type="hidden"
      name="salary2_daysPerWeek"
      value={salary2Data.daysPerWeek}
    />
    <input type="hidden" name="salary2_taxCode" value={salary2Data.taxCode} />
    <input
      type="hidden"
      name="salary2_isScottishResident"
      value={salary2Data.isScottishResident ? 'true' : 'false'}
    />
    {/* Optional fields */}
    <input
      type="hidden"
      name="salary2_pensionPercent"
      value={
        salary2Data.pensionType === 'percentage'
          ? String(salary2Data.pensionValue)
          : ''
      }
    />
    <input
      type="hidden"
      name="salary2_pensionFixed"
      value={
        salary2Data.pensionType === 'fixed'
          ? String(salary2Data.pensionValue)
          : ''
      }
    />
    <input
      type="hidden"
      name="salary2_plan1"
      value={salary2Data.studentLoans.plan1 ? 'true' : 'false'}
    />
    <input
      type="hidden"
      name="salary2_plan2"
      value={salary2Data.studentLoans.plan2 ? 'true' : 'false'}
    />
    <input
      type="hidden"
      name="salary2_plan4"
      value={salary2Data.studentLoans.plan4 ? 'true' : 'false'}
    />
    <input
      type="hidden"
      name="salary2_plan5"
      value={salary2Data.studentLoans.plan5 ? 'true' : 'false'}
    />
    <input
      type="hidden"
      name="salary2_planPostGrad"
      value={salary2Data.studentLoans.planPostGrad ? 'true' : 'false'}
    />
    <input
      type="hidden"
      name="salary2_isBlindPerson"
      value={
        salary2Data.isBlindPerson === null
          ? ''
          : salary2Data.isBlindPerson
          ? 'true'
          : 'false'
      }
    />
    <input
      type="hidden"
      name="salary2_isOverStatePensionAge"
      value={
        salary2Data.isOverStatePensionAge === null
          ? ''
          : salary2Data.isOverStatePensionAge
          ? 'true'
          : 'false'
      }
    />
  </>
);
