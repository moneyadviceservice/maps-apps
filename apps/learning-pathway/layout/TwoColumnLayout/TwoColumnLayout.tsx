import { ReactNode } from 'react';

import KeyInfo, { KeyInfoProps } from 'components/KeyInfo/KeyInfo';

import { SideNavigation } from '@maps-react/mps/components/SideNavigation';
import { SideNavigationModel } from '@maps-react/mps/types';

type Props = {
  children: ReactNode;
  language: string;
  sideNavigation: SideNavigationModel | null;
  keyInfo?: KeyInfoProps;
};
const TwoColumnLayout = ({
  language,
  sideNavigation,
  children,
  keyInfo,
}: Props) => {
  return (
    <div className="flex flex-col-reverse gap-8 text-gray-800 md:flex-row md:gap-10 mt-8 md:mt-10">
      <div className="md:basis-[300px] md:shrink-0">
        <SideNavigation lang={language} navigation={sideNavigation} />
        {keyInfo && <KeyInfo {...keyInfo} />}
      </div>
      <div className="space-y-10 basis-3/5">{children}</div>
    </div>
  );
};

export default TwoColumnLayout;
