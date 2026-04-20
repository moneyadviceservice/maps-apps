import { PensionType } from '../../lib/constants';
import { BuiltIllustration } from '../../lib/types';
import { DetailFeatures } from '../DetailFeatures';
import { EstimateCalculationAccordion } from '../EstimateCalculationAccordion';
import { MoreDetails } from '../MoreDetails';
import { PensionDetailIllustrationDate } from '../PensionDetailIllustrationDate';

type IncomeValuesAccordionsType = {
  item: BuiltIllustration;
  type: 'bar' | 'donut';
};

export const IncomeValuesAccordions = ({
  item,
  type,
}: IncomeValuesAccordionsType) => (
  <>
    <div
      className="mt-3 lg:mt-6 lg:px-2"
      data-testid={`${
        item.calcType === PensionType.DB ? 'db' : 'dc'
      }-calculation-accordion${type === 'donut' ? '-donut' : ''}`}
    >
      <EstimateCalculationAccordion
        illustration={type === 'donut' ? item.donut : item.bar}
        calcType={item.calcType}
      />
    </div>
    <DetailFeatures
      testId={type === 'donut' ? 'features-donut' : 'features'}
      illustration={type === 'donut' ? item.donut : item.bar}
    />
    <MoreDetails
      testId={type === 'donut' ? 'more-details-donut' : 'more-details'}
      illustration={type === 'donut' ? item.donut : item.bar}
    />
    <PensionDetailIllustrationDate date={item.illustrationDate} />
  </>
);
