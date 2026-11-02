import { PensionType } from '../../constants';
import { PensionArrangement } from '../../types';
import { getCalculationType } from './getCalculationType';

/**
 * Determine whether an arrangement will show a specific Chart Type based on CalcType (PensionType).
 * @param data - a PensionArrangement object to check for the specified CalcType
 * @param chartType - the specific Chart Type (PensionType) to check for
 * @returns a boolean indicating whether the arrangement will show the specified Chart Type
 * @usage
 * const hasDCChartType = hasSpecificChartType(data, PensionType.DC)
 */

export const hasSpecificChartType = (
  data: PensionArrangement,
  chartType: PensionType,
): boolean => {
  const allComponents =
    data.benefitIllustrations?.flatMap(
      (illustration) => illustration.illustrationComponents ?? [],
    ) ?? [];

  if (allComponents.length > 0) {
    return allComponents.some(
      (component) =>
        getCalculationType(data.pensionType, component.benefitType) ===
        chartType,
    );
  }

  return getCalculationType(data.pensionType) === chartType;
};
