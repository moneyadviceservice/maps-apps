import { linkClasses } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

interface ActiveFiltersSummaryProps {
  count: number;
  clearHref: string;
}

const ActiveFiltersSummary = ({
  count,
  clearHref,
}: ActiveFiltersSummaryProps) => {
  const { z } = useTranslation();

  return (
    <div className="flex space-x-2 t-active-filters-summary">
      <div className="text-gray-800">
        {count === 1
          ? z(
              { en: '{count} active filter', cy: '{count} hidlydd actif' },
              { count: String(count) },
            )
          : z(
              {
                en: '{count} active filters',
                cy: '{count} hidlyddion actif',
              },
              { count: String(count) },
            )}
      </div>
      <div className="lg:hidden">
        <a
          href={clearHref}
          className={linkClasses.join(' ')}
          title={z({ en: 'Clear all', cy: 'Clirio popeth' })}
        >
          {z({ en: 'Clear all', cy: 'Clirio popeth' })}
        </a>
      </div>
    </div>
  );
};

export default ActiveFiltersSummary;
