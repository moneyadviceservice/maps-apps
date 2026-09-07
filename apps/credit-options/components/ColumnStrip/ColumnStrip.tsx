export type Props = {
  details: { title: string; value: string }[];
};

export const ColumnStrip = ({ details }: Props) => {
  const gridColsClass =
    {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
    }[details.length] ?? 'grid-cols-1';
  return (
    <>
      <table className="w-full table-fixed t-details md:hidden">
        <tbody>
          {details.map(({ title, value }) => (
            <tr key={title + value} className="border-b border-slate-400">
              <td className="py-2 pr-3 t-title">{title}</td>
              <td className="t-value text-[19px] font-semibold">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="hidden t-details md:block">
        <div
          className={`grid ${gridColsClass} divide-x-2 border-slate-400 text-gray-800`}
        >
          {details.map(({ title, value }, i) => (
            <div key={title + value} className="flex flex-col px-6 first:pl-0">
              <div className="t-title flex-grow mb-2 leading-[23px]">
                {title}
              </div>
              <div
                data-testid={`unarranged-formatted-value-${i}`}
                className="t-value text-[19px] font-semibold leading-[25px]"
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
