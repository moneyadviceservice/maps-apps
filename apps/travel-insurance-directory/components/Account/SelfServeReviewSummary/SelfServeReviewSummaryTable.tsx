import { accountTableLinkClassName } from 'data/pages/account/tradingNames';
import type { ReviewSummaryRow } from 'lib/account/reviewSummary/types';

import { Button } from '@maps-react/common/components/Button';

export type SelfServeReviewSummaryTableProps = {
  changeAnswerApi: string;
  changeAnswerHiddenFields?: Record<string, string>;
  questionColumnLabel: string;
  answerColumnLabel: string;
  rows: ReviewSummaryRow[];
};

export const SelfServeReviewSummaryTable = ({
  changeAnswerApi,
  changeAnswerHiddenFields = {},
  questionColumnLabel,
  answerColumnLabel,
  rows,
}: SelfServeReviewSummaryTableProps) => (
  <div className="overflow-x-auto mb-8">
    <table className="w-full border-collapse text-left text-base">
      <thead>
        <tr className="border-b border-gray-200">
          <th
            scope="col"
            className="py-3 pr-8 text-left font-semibold text-gray-800 align-top"
          >
            {questionColumnLabel}
          </th>
          <th
            scope="col"
            className="py-3 pr-8 text-left font-semibold text-gray-800 align-top"
          >
            {answerColumnLabel}
          </th>
          <th
            scope="col"
            className="py-3 text-right font-semibold text-gray-800 align-top"
          >
            <span className="sr-only">Change</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.id}
            className="border-b border-gray-200"
            data-testid={`summary-row-${row.id}`}
          >
            <th
              scope="row"
              className="py-3 pr-8 text-left font-semibold text-gray-800 align-top whitespace-nowrap"
              data-testid={`summary-question-${row.id}`}
            >
              {row.heading}
            </th>
            <td
              className="py-3 pr-8 text-gray-800 align-top"
              data-testid={`summary-answer-${row.id}`}
            >
              {row.answer}
            </td>
            <td className="py-3 text-right align-top whitespace-nowrap">
              <form method="POST">
                {Object.entries(changeAnswerHiddenFields).map(
                  ([name, value]) => (
                    <input key={name} type="hidden" name={name} value={value} />
                  ),
                )}
                <input
                  type="hidden"
                  name="targetPath"
                  value={row.changeTargetPath}
                />
                <Button
                  className={`gap-0 ${accountTableLinkClassName}`}
                  variant="link"
                  formAction={changeAnswerApi}
                  aria-describedby={`summary-question-${row.id}`}
                  data-testid={`change-question-${row.id}`}
                >
                  Change
                </Button>
              </form>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
