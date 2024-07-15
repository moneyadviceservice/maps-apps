import { ageConditions } from 'utils/PensionCalculator/ageConditions';
import { StepName } from './pension-data';
import {
  SalaryFrequency,
  salaryConditions,
} from 'utils/PensionCalculator/salaryConditions';
import { ContributionType } from 'utils/PensionCalculator/contributionCalculator';
import { contributionConditions } from 'utils/PensionCalculator/contributionConditions';

export type ErrorField = {
  field: string;
  type: string;
};

export type ErrorObject = {
  [key: string]: ErrorField;
};

export const navigationRules = (errors: ErrorObject) => {
  const error = Object.keys(errors).length > 0;
  if (error) {
    if (
      errors['age'] ||
      errors['salary'] ||
      errors['frequency'] ||
      errors['contributionType']
    ) {
      return StepName.DETAILS;
    }
  }

  if (error) {
    if (errors['employeeContribution'] || errors['employerContribution']) {
      return StepName.CONTRIBUTIONS;
    }
  }
};

export type PensionInputsValues = {
  age?: string;
  salary?: string;
  frequency?: string;
  contributionType?: ContributionType;
  employeeContribution?: string;
  employerContribution?: string;
};

export const validatePensionInputs = ({
  age,
  salary,
  frequency,
  contributionType,
  employeeContribution,
  employerContribution,
}: PensionInputsValues) => {
  let errors = {} as ErrorObject;

  if (!age && !salary && !frequency && !contributionType) {
    return errors;
  }

  errors = validateAge(age, errors);
  errors = validateSalary(salary, frequency, contributionType, errors);
  if (
    employeeContribution !== undefined &&
    employerContribution !== undefined
  ) {
    errors = validateContributions(
      salary,
      frequency,
      employeeContribution,
      employerContribution,
      errors,
    );
  }

  return errors;
};

export const validateAge = (
  age: string | undefined,
  errors: ErrorObject = {},
) => {
  delete errors['age'];
  if (!age) {
    errors.age = {
      field: 'age',
      type: 'required',
    };
  } else if (isNaN(Number(age))) {
    errors.age = {
      field: 'age',
      type: 'invalid',
    };
  } else if (age && Number(age)) {
    const ageCondition = ageConditions(Number(age));

    if (ageCondition.minRequired) {
      errors.age = {
        field: 'age',
        type: 'min',
      };
    }

    if (ageCondition.maxRequired) {
      errors.age = {
        field: 'age',
        type: 'max',
      };
    }
  }

  return errors;
};

export const validateSalary = (
  salary: string | undefined,
  frequency: string | undefined,
  contributionType: ContributionType | undefined,
  errors: ErrorObject,
) => {
  delete errors['salary'];
  delete errors['contributionType'];
  let salaryFormatted = salary?.replaceAll(',', '');
  if (salaryFormatted === '') {
    errors.salary = {
      field: 'salary',
      type: 'required',
    };
  }

  if (isNaN(Number(salaryFormatted))) {
    errors.salary = {
      field: 'salary',
      type: 'invalid',
    };
  }

  const salaryCondition = salaryConditions(
    Number(salaryFormatted),
    Number(frequency) as SalaryFrequency,
  );

  if (!contributionType) {
    errors.contributionType = {
      field: 'contributionType',
      type: 'required',
    };
  }

  if (
    salaryFormatted?.length &&
    !isNaN(Number(salaryFormatted)) &&
    salaryCondition.belowManualOptIn &&
    contributionType === ContributionType.PART
  ) {
    errors.contributionType = {
      field: 'contributionType',
      type: 'invalid',
    };

    errors.salary = {
      field: 'contributionType',
      type: 'min',
    };
  }

  return errors;
};

export function validateContributions(
  salary: string | undefined,
  frequency: string | undefined,
  employeeContribution: string | undefined,
  employerContribution: string | undefined,
  errors: ErrorObject,
) {
  const salaryCondition = contributionConditions({
    salary: Number(salary?.replaceAll(',', '')),
    frequency: Number(frequency) as SalaryFrequency,
    employeeContribution: Number(employeeContribution),
    employerContribution: Number(employerContribution),
  });

  const employeeInvalid = isNaN(Number(employeeContribution));
  const employerInvalid = isNaN(Number(employerContribution));

  if (
    salaryCondition.requiredMinimum ||
    employeeContribution?.length === 0 ||
    employeeInvalid
  ) {
    errors.contribution = {
      field: 'contribution',
      type: 'required',
    };

    if (Number(employeeContribution) === 0) {
      errors.employeeContribution = {
        field: 'employeeContribution',
        type: 'required',
      };
    }

    if (employeeInvalid) {
      errors.employeeContribution = {
        field: 'employeeContribution',
        type: 'invalid',
      };
    }
  }

  if (salaryCondition.employerMinimum) {
    errors.employerContribution = {
      field: 'employerContribution',
      type: 'min',
    };
  }

  if (Number(employerContribution) === 0) {
    errors.employerContribution = {
      field: 'employerContribution',
      type: 'required',
    };
  }

  if (employerInvalid) {
    errors.employerContribution = {
      field: 'employerContribution',
      type: 'invalid',
    };
  }

  return errors;
}
