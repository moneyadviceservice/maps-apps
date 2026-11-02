import { v4 as uuidv4 } from 'uuid';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import { ListElement } from '@maps-react/common/index';

type Props = {
  title: string;
  items: React.ReactNode[];
};

export const Checklist = ({ title, items }: Props) => {
  return (
    <>
      <p className="pb-[8px]">{title}</p>
      <ListElement
        variant="none"
        color="none"
        className="w-full"
        items={items.map((item) => {
          return (
            <span key={uuidv4()} className="flex flex-row py-[4px]">
              <Icon className="mr-2" type={IconType.TICK_GREEN} width={24} />
              {item}
            </span>
          );
        })}
      />
    </>
  );
};
