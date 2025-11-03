import { dbClassificationMatrix } from './matrices/dbPensions';
import { dcClassificationMatrix } from './matrices/dcPensions';
import type { ClassifiablePension, PensionChannel } from './types';

/**
 * If the ERI code is undefined or an empty string, default it to none.
 */
function normaliseEriCode(pension: ClassifiablePension) {
  return pension.eriDetails.unavailableReason === '' ||
    !pension.eriDetails.unavailableReason
    ? 'None'
    : pension.eriDetails.unavailableReason;
}

/**
 * If the accured amount code is undefined or an empty string, default it to none.
 */
function normaliseAccuredAmountCode(pension: ClassifiablePension) {
  return pension.apDetails.unavailableReason === '' ||
    !pension.apDetails.unavailableReason
    ? 'None'
    : pension.apDetails.unavailableReason;
}

export class PensionClassificationUtils {
  /**
   * Given a pension JSON object, return the expected channel.
   *
   * Uses the ClassificationMatrix class.
   */
  static getChannel(pension: ClassifiablePension): PensionChannel {
    // Normalise any data that might not conform to the standard.
    const eriCode = normaliseEriCode(pension);
    const accuredAmountCode = normaliseAccuredAmountCode(pension);

    // Match types.
    if (pension.matchType === 'POSS' || pension.matchType === 'CONT')
      return 'RED';
    if (pension.matchType === 'NEW' || pension.matchType === 'SYS')
      return 'YELLOW';
    if (pension.matchType !== 'DEFN')
      throw new Error(
        `Unexpected pension match type of "${pension.matchType}", should be either POSS, CONT, NEW, SYS or DEFN`,
      );

    const isPensionMissingComponents = (pension: ClassifiablePension) =>
      !pension.apDetails.componentExists || !pension.eriDetails.componentExists;

    // Apply matrix
    switch (pension.pensionType) {
      case 'DC':
        if (isPensionMissingComponents(pension)) return 'YELLOW';
        return dcClassificationMatrix
          .accuredAmountCode(accuredAmountCode)
          .eriAmountCode(eriCode);

      case 'DB':
        if (isPensionMissingComponents(pension)) return 'YELLOW';
        return dbClassificationMatrix
          .accuredAmountCode(accuredAmountCode)
          .eriAmountCode(eriCode);

      case 'SP':
        if (isPensionMissingComponents(pension)) return 'YELLOW';
        return 'GREEN';

      default:
        return 'UNSUPPORTED';
    }
  }
}
