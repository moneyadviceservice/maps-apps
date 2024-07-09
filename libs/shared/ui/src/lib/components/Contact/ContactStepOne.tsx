import { useTranslation } from '@maps-digital/shared/hooks';
import { Button } from '../Button';

const ContactStepOne = ({
  handleType,
  guidanceList,
}: {
  handleType: (value: string) => void;
  guidanceList: Record<string, string>[];
}) => {
  const { z } = useTranslation();
  return (
    <div className="flex py-1">
      {guidanceList.map((val) => {
        const g = Object.keys(val);
        return (
          <Button
            key={g.toString()}
            data-testid={g.toString()}
            variant="secondary"
            className="t-chat-panel-button mr-2 mt-4 py-3 px-4 text-xl"
            onClick={() => handleType(g.toString())}
          >
            <div className="font-bold break-words text-center">
              {z(
                { en: '{g} guidance', cy: 'Arweiniad {g}' },
                { g: g.toString() },
              )}
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default ContactStepOne;
