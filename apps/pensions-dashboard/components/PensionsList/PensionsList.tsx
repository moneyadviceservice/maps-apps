import { PensionArrangement } from '../../lib/types';

type PensionsListProps = {
  icon: React.ReactElement;
  pensions: PensionArrangement[];
};

export const PensionsList = ({ pensions, icon }: PensionsListProps) => {
  return (
    <ul>
      {pensions.map(({ externalAssetId, schemeName }) => (
        <li key={externalAssetId} className="flex items-center gap-3 mt-4">
          <span className="w-[24px] h-[24px] flex-shrink-0 ml-1 sm:ml-0">
            {icon}
          </span>
          {schemeName}
        </li>
      ))}
    </ul>
  );
};
