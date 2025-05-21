import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { Salary } from '../../utils/calculateStatutoryRedundancyPay';

export enum Country {
  England,
  Scotland,
  Wales,
  NorthernIreland,
}

export enum ContractualRedundancyProvided {
  Yes,
  No,
  Unknown,
}

type ContractualRedundancyAmount =
  | number
  | ContractualRedundancyProvided.Unknown;

export type ContractualRedundancy = {
  provided: ContractualRedundancyProvided;
  amount: number | ContractualRedundancyProvided.Unknown;
};

export type ParsedData = {
  dateOfBirth: string | undefined;
  salary: Salary | undefined;
  jobStart: string | undefined;
  jobEnd: string | undefined;
  country: Country | undefined;
  contractualRedundancy: ContractualRedundancy | undefined;
};

/**
 * Parses the stored data from a query and maps it to a structured format.
 *
 * @param storedData - The raw data retrieved from a query, containing key-value pairs.
 * @returns An object containing parsed and structured data, including:
 * - `dateOfBirth`: The date of birth extracted from the query data.
 * - `salary`: The parsed salary value.
 * - `jobStart`: The start date of the job.
 * - `jobEnd`: The end date of the job.
 * - `country`: The parsed country information.
 * - `contractualRedundancy`: The parsed contractual redundancy details.
 */
export const parseStoredData = (storedData: DataFromQuery): ParsedData => {
  return {
    dateOfBirth: storedData['q-2'],
    salary: parseSalary(storedData['q-5']),
    jobStart: storedData['q-4'],
    jobEnd: storedData['q-3'],
    country: parseCountry(storedData['q-1']),
    contractualRedundancy: parseContractualRedundancy(
      storedData['q-6'],
      storedData['q-7'],
    ),
  };
};

/**
 * Parses the provided string to determine the corresponding country.
 *
 * @param q1 - A string representing the country identifier.
 * @returns The parsed `Country` if the input is valid, or `undefined` if the input is empty or invalid.
 */
const parseCountry = (q1: string): Country | undefined => {
  if (!q1) return undefined;

  return Number(q1);
};

/**
 * Parses a salary string into a `Salary` object.
 *
 * The input string `q5` is expected to have a format where the salary amount
 * and frequency are separated by a comma. For example: "50,000,12".
 *
 * - The portion before the last comma is treated as the salary amount.
 * - The portion after the last comma is treated as the frequency.
 *
 * @param q5 - The salary string to parse. If the string is empty or undefined, the function returns `undefined`.
 * @returns A `Salary` object containing the `amount` and `frequency`, or `undefined` if the input is invalid.
 */
const parseSalary = (q5: string): Salary | undefined => {
  if (!q5) return undefined;

  const lastCommaIndex = q5.lastIndexOf(',');
  const amount = Number(q5.substring(0, lastCommaIndex).replaceAll(',', ''));
  const frequency = Number(q5.substring(lastCommaIndex + 1));

  return { amount, frequency };
};

/**
 * Parses the contractual redundancy information based on the provided inputs.
 *
 * @param q6 - A string representing whether contractual redundancy is provided.
 *             Expected values:
 *             - '1' for Yes
 *             - '2' for "I don't know"
 *             - Any other value is treated as No
 * @param q7 - A string representing the amount of contractual redundancy,
 *             formatted with commas (e.g., "1,000"). The last segment after
 *             the last comma indicates whether the amount is known:
 *             - '1' indicates the amount is unknown
 *             - Any other value indicates the amount is known
 *
 * @returns An object of type `ContractualRedundancy` containing:
 *          - `provided`: Indicates whether contractual redundancy is provided
 *                        (Yes, No, or Unknown).
 *          - `amount`: The known amount of contractual redundancy, or 0 if unknown.
 *          Returns `undefined` if the input data is insufficient or invalid.
 */
export const parseContractualRedundancy = (
  q6: string,
  q7: string,
): ContractualRedundancy | undefined => {
  if (!q6) return undefined;

  let provided = Number(q6);

  let amount: ContractualRedundancyAmount = 0;

  const q6IDontKnow = q6 === '2';
  if (q6IDontKnow) {
    provided = ContractualRedundancyProvided.No;
  }

  if (provided === ContractualRedundancyProvided.Yes) {
    if (!q7) return undefined;

    const lastCommaIndex = q7.lastIndexOf(',');
    const isKnown = Number(q7.substring(lastCommaIndex + 1)) !== 1;
    const knownAmount = Number(q7.substring(0).replaceAll(',', ''));

    if (isKnown) {
      amount = knownAmount;
    } else {
      provided = ContractualRedundancyProvided.Unknown;
    }
  }

  return {
    provided,
    amount,
  };
};

/**
 * Formats a number into a localized string representation using the 'en-GB' locale.
 * The formatted string includes up to two decimal places.
 *
 * @param number - The number to be formatted.
 * @returns The formatted number as a string.
 */
export const formatNumber = (number: number): string =>
  number.toLocaleString('en-GB', { maximumFractionDigits: 2 });
