import {
  SPECIAL_TAX_CODES_ENGLAND,
  SPECIAL_TAX_CODES_SCOTLAND,
} from 'utils/rates/constants';

export interface SalaryTrackingProps {
  salary1: {
    taxCode: string;
    grossIncome: string;
    isBlindPerson: boolean | null;
    isOverStatePensionAge: boolean | null;
  };
  salary2?: {
    taxCode?: string;
    grossIncome: string;
    isBlindPerson?: boolean | null;
    isOverStatePensionAge?: boolean | null;
  } | null;
  calculationType: 'single' | 'joint';
  hasResults: boolean;
  recalculated?: boolean;
  title: string;
}

const ALL_SPECIAL_CODES = {
  ...SPECIAL_TAX_CODES_ENGLAND,
  ...SPECIAL_TAX_CODES_SCOTLAND,
};

const getToolStep = (recalculated?: boolean, hasResults?: boolean): string => {
  if (recalculated) return '2.5';
  if (hasResults) return '2';
  return '1';
};

function getStepName(
  toolStep: string,
  hasResults: boolean,
  recalculated: boolean | undefined,
  calculationType: 'single' | 'joint',
): string {
  if (toolStep === '1') return 'Salary Calculator - start';
  return `Salary Calculator${hasResults ? ' Results' : ''}${
    recalculated ? ' recalculated' : ''
  } - ${
    calculationType === 'single' ? 'standard' : 'salary comparison'
  } - current tax year`;
}

function getIsOverStatePensionAge(
  salary1: { isOverStatePensionAge: boolean | null },
  salary2?: { isOverStatePensionAge?: boolean | null } | null,
): boolean {
  return Boolean(
    salary1.isOverStatePensionAge || salary2?.isOverStatePensionAge,
  );
}

function getIsBlindPerson(
  salary1: { isBlindPerson: boolean | null },
  salary2?: { isBlindPerson?: boolean | null } | null,
): boolean {
  return Boolean(salary1.isBlindPerson || salary2?.isBlindPerson);
}

export const formatTaxCode = (taxCode?: string) => {
  if (!taxCode) return '';

  const raw = taxCode.trim().toUpperCase();
  if (!raw) return '';

  const emergencyCodes = ['M1', 'W1', 'X'];

  const getRegion = (code: string) =>
    code.startsWith('S') || code.startsWith('C') ? code[0] : '';
  const getEmergency = (code: string) =>
    emergencyCodes.find((e) => code.endsWith(e)) || '';
  const stripNumeric = (code: string) => code.replace(/^\d+/, '');

  const region = getRegion(raw);
  let code = region ? raw.slice(1) : raw;

  if (!region && ALL_SPECIAL_CODES[raw]) return raw;

  const kPart = code.startsWith('K') ? 'K' : '';
  if (kPart) code = code.slice(1);

  const emergency = getEmergency(code);
  if (emergency) code = code.slice(0, -emergency.length);

  if (code === '0T') return region ? `${region}#0T` : '0T';

  const mainPart = stripNumeric(code);
  const result = `${kPart}${mainPart}`;

  if (region)
    return emergency
      ? `${region}#${result}${emergency}`
      : `${region}#${result}`;
  if (emergency) return `${result}#${emergency}`;
  return result;
};

export const getSalaryTrackingData = ({
  salary1,
  salary2,
  calculationType,
  hasResults,
  recalculated,
  title,
}: SalaryTrackingProps) => {
  const toolStep = getToolStep(recalculated, hasResults);
  const isOverStatePensionAge = getIsOverStatePensionAge(salary1, salary2);
  const isBlindPerson = getIsBlindPerson(salary1, salary2);
  const gross = Number(salary1.grossIncome);
  const emolument = gross > 0 ? Math.max(1, Math.round(gross / 1000)) : 0;

  const stepName = getStepName(
    toolStep,
    hasResults,
    recalculated,
    calculationType,
  );
  const otherSupport = formatTaxCode(salary1.taxCode);

  const base = {
    page: {
      pageName: 'salary-calculator',
      pageTitle: title,
      categoryLevels: ['Tools', 'Money'],
    },
    tool: {
      toolName: 'Salary Calculator',
      toolCategory: 'simple calculator',
      toolStep,
      stepName,
    },
  };

  return {
    ...base,
    tool: {
      ...base.tool,
      ...(hasResults && {
        outcome: {
          benefit: isBlindPerson ? 'Blind person allowance' : '',
          otherSupport,
        },
      }),
    },
    ...(hasResults && {
      demo: {
        bYear: isOverStatePensionAge ? '66+' : '',
        emolument,
        isHealth: isBlindPerson,
      },
    }),
  };
};
