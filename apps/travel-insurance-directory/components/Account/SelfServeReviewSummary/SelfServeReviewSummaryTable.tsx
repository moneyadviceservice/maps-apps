import type { ReviewSummaryRow } from 'lib/account/shared/reviewSummary';

export type SelfServeReviewSummaryTableProps = {
  changeAnswerApi: string;
  changeAnswerHiddenFields?: Record<string, string>;
  questionColumnLabel: string;
  answerColumnLabel: string;
  rows: ReviewSummaryRow[];
};

const questionCellClassName =
  'block w-full py-2 pr-0 text-left font-normal text-gray-800 align-top md:table-cell md:w-1/2 md:py-3 md:pr-8';
const answerCellClassName =
  'block w-full py-2 pr-0 text-left font-normal text-gray-800 align-top md:table-cell md:w-[35%] md:py-3 md:pr-8';
const actionCellClassName =
  'block w-full py-2 text-left align-top md:table-cell md:w-[15%] md:py-3 md:text-right md:whitespace-nowrap';

const changeLinkClassName =
  'cursor-pointer border-0 bg-transparent p-0 text-base font-normal text-magenta-750 underline hover:text-magenta-750 hover:no-underline focus:text-magenta-750';

export const SelfServeReviewSummaryTable = ({
  changeAnswerApi,
  changeAnswerHiddenFields = {},
  questionColumnLabel,
  answerColumnLabel,
  rows,
}: SelfServeReviewSummaryTableProps) => (
  <div className="mb-8">
    <table className="w-full table-auto border-collapse text-left text-base md:table-fixed">
      <colgroup>
        <col className="md:w-1/2" />
        <col className="md:w-[35%]" />
        <col className="md:w-[15%]" />
      </colgroup>
      <thead className="hidden md:table-header-group">
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
            className="block border-b border-gray-200 pb-4 mb-4 last:mb-0 md:table-row md:pb-0 md:mb-0"
            data-testid={`summary-row-${row.id}`}
          >
            <th
              scope="row"
              className={questionCellClassName}
              data-testid={`summary-question-${row.id}`}
            >
              <span className="block mb-1 text-sm font-semibold md:hidden">
                {questionColumnLabel}
              </span>
              {row.heading}
            </th>
            <td
              className={answerCellClassName}
              data-testid={`summary-answer-${row.id}`}
            >
              <span className="block mb-1 text-sm font-semibold md:hidden">
                {answerColumnLabel}
              </span>
              <span data-testid={`summary-answer-value-${row.id}`}>
                {row.answer}
              </span>
            </td>
            <td className={actionCellClassName}>
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
                <button
                  type="submit"
                  className={changeLinkClassName}
                  formAction={changeAnswerApi}
                  aria-describedby={`summary-question-${row.id}`}
                  data-testid={`change-question-${row.id}`}
                >
                  Change
                </button>
              </form>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
