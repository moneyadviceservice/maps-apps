import { PensionType } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';

type PensionsListProps = {
  icon: React.ReactElement;
  pensions: PensionArrangement[];
};

export const PensionsList = ({ pensions, icon }: PensionsListProps) => {
  return (
    <ul>
      {pensions.map(
        ({
          externalAssetId,
          pensionType,
          schemeName,
          pensionAdministrator: { name },
        }) => (
          <li key={externalAssetId} className="flex items-center gap-2 mt-4">
            <span className="w-[24px] h-[24px]">{icon}</span>
            {pensionType === PensionType.SP ? schemeName : name}
          </li>
        ),
      )}
    </ul>
  );
};
