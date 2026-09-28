import Link from 'next/link';

import { SalaryFormData } from 'components/SalaryForm';
import { buildSalaryQueryParams } from 'utils/helpers/buildSalaryQueryParams';

type NoScriptSwitcherProps = {
  calculationType: 'single' | 'joint';
  salary1: SalaryFormData;
  salary2?: SalaryFormData;
  locale: string;
  z: (strings: { en: string; cy: string }) => string;
};

/**
 * Non-JS fallback links to switch between single/joint calculation
 */
export const NoScriptSwitcher: React.FC<NoScriptSwitcherProps> = ({
  calculationType,
  salary1,
  salary2,
  locale,
  z,
}) => (
  <noscript>
    <div className="col-span-12 mb-6">
      <div className="flex gap-x-8">
        {calculationType === 'single' && (
          <Link
            href={`/${locale}?calculationType=joint&${buildSalaryQueryParams(
              salary1,
            )}${
              salary2 ? `&${buildSalaryQueryParams(salary2, 'salary2_')}` : ''
            }`}
            className="text-pink-600 font-semibold underline whitespace-nowrap w-[220px]"
          >
            {z({ en: 'Compare two salaries', cy: 'Cymharu dau gyflog' })}
          </Link>
        )}
        {calculationType === 'joint' && (
          <Link
            href={`/${locale}?calculationType=single&${buildSalaryQueryParams(
              salary1,
            )}${
              salary2 ? `&${buildSalaryQueryParams(salary2, 'salary2_')}` : ''
            }`}
            className="text-pink-600 font-semibold underline whitespace-nowrap w-[220px]"
          >
            {z({ en: 'Single calculation', cy: 'Cyfrifiad sengl' })}
          </Link>
        )}
      </div>
    </div>
  </noscript>
);
