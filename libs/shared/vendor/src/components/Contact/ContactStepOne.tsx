import { Button } from '@maps-react/common/components/Button';
import { useTranslation } from '@maps-react/hooks/useTranslation';

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
            className="px-4 py-3 mt-4 mr-2 text-xl t-chat-panel-button"
            onClick={() => handleType(g.toString())}
          >
            <div className="font-bold text-center break-words">
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
