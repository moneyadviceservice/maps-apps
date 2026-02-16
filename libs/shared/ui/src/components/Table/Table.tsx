import { H6 } from '../Heading';

export type TableProps = {
  title?: string;
  columnHeadings?: string[];
  data: (string | JSX.Element)[][];
  variant?: 'numeric';
};

export const Table = ({
  title,
  columnHeadings = [],
  data,
  variant,
}: TableProps) => {
  const isNumericVariant = variant === 'numeric';
  return (
    <div className="py-6">
      {title && <H6 className="text-left">{title}</H6>}
      <table className={`table-auto w-full ${title ? 'mt-2' : ''}`}>
        <thead>
          <tr className="border-b border-slate-400">
            {columnHeadings?.map((heading, index) => (
              <th
                key={index}
                className={`py-2 pl-2 text-left ${
                  isNumericVariant && index === 1
                    ? 'pl-[105px] xl:pl-[115px]'
                    : ''
                }`}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-slate-400">
              {row.map((column, columnIndex) => (
                <td
                  key={`${rowIndex}-${columnIndex}`}
                  className={`py-2 pl-2 ${
                    isNumericVariant && columnIndex === 1
                      ? 'pl-[105px] xl:pl-[115px]'
                      : ''
                  }`}
                >
                  {column}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
