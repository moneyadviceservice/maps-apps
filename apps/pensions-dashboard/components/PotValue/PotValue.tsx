import { twMerge } from 'tailwind-merge';
import { ExpandableSection, Paragraph } from '@maps-digital/shared/ui';

import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionArrangement } from '../../lib/types';
import { currencyAmount, tooltipScreenReaderText } from '../../lib/utils/ui';
import { getPensionTypeClasses } from '../../lib/utils/ui/getPensionTypeColors';
import { PensionDetailCallout } from '../PensionDetailCallout';

export const PotValue = ({ data }: { data: PensionArrangement }) => {
  const { t } = useTranslation();

  const components =
    data.benefitIllustrations?.flatMap((i) => i.illustrationComponents) ?? [];

  const hasDCPot = components.some((c) => c.benefitType === 'DC' && c.dcPot);
  const hasAVCPot = components.some((c) => c.benefitType === 'AVC' && c.dcPot);
  const hasCBSPot = components.some((c) => c.benefitType === 'CBS' && c.dcPot);

  const totalPot = components.reduce((total, c) => {
    if (c.dcPot && c.illustrationType === 'AP' && c.benefitType !== 'DB') {
      return total + c.dcPot;
    }
    return total;
  }, 0);

  if (totalPot === 0) return null;

  const { potTextClass } = getPensionTypeClasses(data.pensionType);

  const getKey = (type: 'accordion' | 'text') => {
    const activePots = [
      hasDCPot && 'dc',
      hasAVCPot && 'avc',
      hasCBSPot && 'cbs',
    ].filter(Boolean); // removes any false values

    if (activePots.length === 0) return undefined;

    return [type, ...activePots].join('-');
  };

  const potMessageKey = getKey('accordion');
  const potTextKey = getKey('text');

  const potMessage = potMessageKey
    ? t(`components.pension-pot.${potMessageKey}`)
    : undefined;

  const potText = potTextKey
    ? t(`components.pension-pot.${potTextKey}`)
    : undefined;

  return (
    <PensionDetailCallout testId="pot-value" className="px-3 pt-2 md:pt-3">
      <Paragraph data-testid="pot-value-title" className="mb-1 md:mb-2">
        {t('components.pension-pot.title')}
        <Markdown
          disableParagraphs
          className="ml-3 text-left"
          content={t('tooltips.pot-value')}
          tooltipProps={{
            accessibilityLabelOpen: tooltipScreenReaderText(
              t('tooltips.sr-text.pot-value'),
              t,
            ),
          }}
        />
      </Paragraph>

      <Paragraph data-testid="pot-value-amount" className="mb-0">
        <span
          className={twMerge(
            potTextClass,
            'text-2xl md:text-4xl font-semibold',
          )}
        >
          {currencyAmount(totalPot)}
        </span>
        {potText && (
          <span
            data-testid="pot-value-text"
            className="text-lg font-bold tracking-wide md:text-xl"
          >
            {' '}
            {potText}
          </span>
        )}
      </Paragraph>

      {potMessage && (
        <ExpandableSection
          className="text-base font-semibold"
          contentTestClassName="mb-0"
          title={t('components.pension-pot.accordion-title')}
          testId="pot-value-accordion"
        >
          <div
            className="leading-[1.6] font-normal"
            data-testid="pot-value-message"
          >
            <Markdown content={potMessage} />
          </div>
        </ExpandableSection>
      )}
    </PensionDetailCallout>
  );
};
