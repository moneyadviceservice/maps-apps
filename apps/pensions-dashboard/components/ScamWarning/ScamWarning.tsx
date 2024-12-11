import { Heading } from '@maps-react/common/components/Heading';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';

type Props = {
  title: string;
  children: React.ReactNode;
};

export const ScamWarning = ({ title, children }: Props) => {
  return (
    <InformationCallout
      variant="withDominantBorder"
      className="px-6 py-8 mt-12 md:px-12"
    >
      <Heading level="h3" className="mb-4">
        {title}
      </Heading>
      {children}
    </InformationCallout>
  );
};
