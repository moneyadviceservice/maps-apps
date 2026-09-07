import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';

type Props = {
  prosTitle: string;
  consTitle: string;
  pros: string[];
  cons: string[];
};

export const ProsConsCards = ({ prosTitle, consTitle, pros, cons }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
      <Callout variant={CalloutVariant.POSITIVE}>
        <Heading level="h5" component="span">
          {prosTitle}
        </Heading>
        <ListElement
          variant="pros"
          color="blue"
          className="pt-4"
          items={pros}
        />
      </Callout>
      <Callout variant={CalloutVariant.NEGATIVE}>
        <Heading level="h5" component="span">
          {consTitle}
        </Heading>
        <ListElement
          variant="cons"
          color="blue"
          className="pt-4"
          items={cons}
        />
      </Callout>
    </div>
  );
};
