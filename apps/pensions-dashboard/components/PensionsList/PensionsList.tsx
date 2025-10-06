import { PensionArrangement } from '../../lib/types';

type PensionsListProps = {
  icon: React.ReactElement;
  pensions: PensionArrangement[];
};

export const PensionsList = ({ pensions, icon }: PensionsListProps) => {
  return (
    <ul>
      {pensions.map(({ externalAssetId, schemeName }) => (
        <li
          key={externalAssetId}
          className="flex items-start gap-2 mt-5 leading-7 lg:gap-3"
        >
          <span className="w-[24px] h-[24px] flex-shrink-0 ml-2 sm:ml-0 mt-1">
            {icon}
          </span>
          {schemeName}
        </li>
      ))}
    </ul>
  );
};
