import { useRouter } from 'next/navigation';

import { JOURNEY_PAGES } from 'data/journey';
import { pensionPotsCopy } from 'data/pension-pots-summary';
import { usePensionsForm } from 'hooks/usePensionsForm';
import { journeyPath } from 'utils/journeyPath/journeyPath';

import { H2 } from '@maps-react/common/components/Heading/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph/Paragraph';
import { useContextLanguage } from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { PensionSummaryCard } from '../PensionSummaryCard';

type Props = {
  data: ReturnType<typeof usePensionsForm>['data'];
  sessionId: string;
  handleRemove: (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => Promise<void>;
};

export const Summary = ({ data, sessionId, handleRemove }: Props) => {
  const { z } = useTranslation();
  const lang = useContextLanguage();
  const router = useRouter();

  const removeHandler = async (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    event.preventDefault();
    await handleRemove(event, index);
    if (data.pots.length <= 1) {
      router.push(journeyPath(lang, JOURNEY_PAGES.POT_DETAILS, sessionId));
    }
  };

  return (
    <>
      <H2>{pensionPotsCopy(z).summaryHeading}</H2>
      {data.pots?.length ? (
        <div className="space-y-12">
          {data.pots.map((pot, index) => (
            <PensionSummaryCard
              key={pot.name.replaceAll(' ', '-') + '-' + index}
              pot={pot}
              index={index}
              handleRemove={removeHandler}
              sessionId={sessionId}
            />
          ))}
        </div>
      ) : (
        <Paragraph>No pension pots added.</Paragraph>
      )}
    </>
  );
};
