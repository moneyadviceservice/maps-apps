import { useTranslation } from '@maps-react/hooks/useTranslation';

export interface ResultsSummaryProps {
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

export const ResultsSummary = ({
  startIndex,
  endIndex,
  totalItems,
}: ResultsSummaryProps) => {
  const { z } = useTranslation();
  const from = totalItems === 0 ? 0 : startIndex + 1;
  const to = endIndex;

  return (
    <p className="text-[18px] text-gray-800" data-testid="results-summary">
      <strong className="font-bold text-gray-900">
        {z(
          {
            en: 'Showing {from} – {to} of {total} firms',
            cy: 'Yn dangos {from} – {to} o {total} o fusnesau',
          },
          { from: String(from), to: String(to), total: String(totalItems) },
        )}
      </strong>{' '}
      {z({
        en: 'Firms presented in no particular order.',
        cy: "Busnesau wedi'u cyflwyno heb unrhyw drefn benodol.",
      })}
    </p>
  );
};
