import { Callout, CalloutVariant, H3 } from '@maps-react/common/index';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import copy from '../../../data/form-content/text/results';
import { calculateMonthsWorthOfSalary } from '../../../utils/calculateMonthsWorthOfSalary';
import { Salary } from '../../../utils/calculateStatutoryRedundancyPay';
import { Country } from '../../../utils/parseStoredData';

type Props = {
  salary: Salary;
  redundancyPay: number;
  country: Country;
};

export const RedundancyForecast = ({
  salary,
  redundancyPay,
  country,
}: Props) => {
  const { z } = useTranslation();

  const monthsWorthOfSalary = calculateMonthsWorthOfSalary(
    redundancyPay,
    salary,
    country,
  );

  return (
    <div className="mb-4 lg:mb-0">
      <Callout variant={CalloutVariant.INFORMATION} className="pt-2">
        <H3 className="mb-4">{z(copy.redundancyForecastTitle)}</H3>
        <p>
          {z(
            copy.redundancyForecast(salary, redundancyPay, monthsWorthOfSalary),
          )}
        </p>
      </Callout>
    </div>
  );
};
