import { Button } from '@maps-react/common/components/Button';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { APIS, PATHS } from '../../CONSTANTS';

type Props = {
  lang: string;
  noSlots?: boolean;
};

export const IssueBookingSection = ({ lang, noSlots }: Props) => {
  const { z } = useTranslation();

  return (
    <>
      <Paragraph className="font-bold">
        {z({
          en: 'Alternatively, pick a different method of referral:',
          cy: 'Fel arall, dewiswch ddull cyfeirio arall:',
        })}
      </Paragraph>
      <Paragraph>
        <Link
          href={`/${lang}/${PATHS.START}/q-4?q-1=1&q-2=0&q-3=1`}
          data-testid={'another-referral=link'}
        >
          {z({
            en: 'Go back to choose another referral method',
            cy: 'Ewch yn ôl i ddewis dull cyfeirio arall',
          })}
        </Link>
        <span>
          {noSlots
            ? z({
                en: ', this could be online or face-to-face.',
                cy: ', gallai hwn fod ar-lein neu wyneb yn wyneb.',
              })
            : z({
                en: ', this could be online, face-to-face or to have an immediate call back on the telephone.',
                cy: ', gallai hwn fod ar-lein, wyneb yn wyneb, neu ffonio yn ôl yn syth.',
              })}
        </span>
      </Paragraph>
      <div className="space-y-4 sm:space-x-8">
        <Button
          variant="secondary"
          type="button"
          as="a"
          href={`/${APIS.LOGOUT}`}
          data-testid="sign-out-button"
          data-cy="sign-out-button"
          className="w-full sm:w-auto"
        >
          {z({
            en: 'Sign out',
            cy: 'Allgofnodi',
          })}
        </Button>
        <Button
          variant="secondary"
          type="button"
          as="a"
          href={`/${APIS.RESTART_TOOL}?lang=${lang}`}
          data-testid="restart-tool-button"
          data-cy="restart-tool-button"
          className="w-full sm:w-auto"
        >
          {z({
            en: 'Make another referral',
            cy: 'Gwneud atgyfeiriad arall',
          })}
        </Button>
      </div>
    </>
  );
};
