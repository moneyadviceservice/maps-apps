import { Heading } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import {
  NotificationBox,
  NotificationBoxVariant,
} from '@maps-react/common/components/NotificationBox';

type Props = {
  prosTitle: string;
  consTitle: string;
  pros: string[];
  cons: string[];
};

export const ProsConsCards = ({ prosTitle, consTitle, pros, cons }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
      <NotificationBox variant={NotificationBoxVariant.POSITIVE}>
        <Heading level="h5" component="span">
          {prosTitle}
        </Heading>
        <ListElement
          variant="pros"
          color="blue"
          className="pt-4"
          items={pros}
        />
      </NotificationBox>
      <NotificationBox variant={NotificationBoxVariant.NEGATIVE}>
        <Heading level="h5" component="span">
          {consTitle}
        </Heading>
        <ListElement
          variant="cons"
          color="blue"
          className="pt-4"
          items={cons}
        />
      </NotificationBox>
    </div>
  );
};
