import useTranslation from '@maps-react/hooks/useTranslation';

import { LinkList } from '../../components/LinkList';

interface FindOutMoreProps {
  buyerType: 'firstTimeBuyer' | 'nextHome' | 'additionalHome';
  isEmbedded: boolean;
}

export const FindOutMore = ({ buyerType, isEmbedded }: FindOutMoreProps) => {
  const { z } = useTranslation();

  return (
    <div className="lg:max-w-4xl">
      {buyerType === 'firstTimeBuyer' && (
        <LinkList
          title={z({ en: 'Find out more:', cy: 'Darganfyddwch fwy:' })}
          description={undefined}
          links={[
            {
              title: z({
                en: 'First-time home buyer guide',
                cy: 'Canllaw prynwr cartref am y tro cyntaf',
              }),
              href: z({
                en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/first-time-buyer-money-tips',
                cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/first-time-buyer-money-tips',
              }),
            },
            {
              title: z({
                en: 'Homebuyer surveys and costs',
                cy: 'Arolygon a chostau prynwyr tai',
              }),
              href: z({
                en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/a-guide-to-homebuyer-surveys-and-costs',
                cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/a-guide-to-homebuyer-surveys-and-costs',
              }),
            },
            {
              title: z({
                en: 'The cost of buying a house and moving',
                cy: 'Y gost o brynu tŷ a symud',
              }),
              href: z({
                en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/estimate-your-overall-buying-and-moving-costs',
                cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/estimate-your-overall-buying-and-moving-costs',
              }),
            },
          ]}
          isEmbedded={isEmbedded}
        />
      )}
      {buyerType === 'nextHome' && (
        <LinkList
          title={z({ en: 'Find out more:', cy: 'Darganfyddwch fwy:' })}
          description={undefined}
          links={[
            {
              title: z({
                en: 'Home-buying process: steps to buying a new house or flat in England, Wales and Northern Ireland',
                cy: 'Proses prynu cartref: camau i brynu tŷ neu fflat newydd yng Nghymru, Lloegr a Gogledd Iwerddon',
              }),
              href: z({
                en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/money-timeline-when-buying-property-england-wales-n-ireland',
                cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/money-timeline-when-buying-property-england-wales-n-ireland',
              }),
            },
            {
              title: z({
                en: 'Homebuyer surveys and costs',
                cy: 'Arolygon a chostau prynwyr tai',
              }),
              href: z({
                en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/a-guide-to-homebuyer-surveys-and-costs',
                cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/a-guide-to-homebuyer-surveys-and-costs',
              }),
            },
            {
              title: z({
                en: 'The cost of buying a house and moving',
                cy: 'Y gost o brynu tŷ a symud',
              }),
              href: z({
                en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/estimate-your-overall-buying-and-moving-costs',
                cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/estimate-your-overall-buying-and-moving-costs',
              }),
            },
          ]}
          isEmbedded={isEmbedded}
        />
      )}
      {buyerType === 'additionalHome' && (
        <LinkList
          title={z({ en: 'Find out more:', cy: 'Darganfyddwch fwy:' })}
          description={undefined}
          links={[
            {
              title: z({
                en: 'Buy-to-let mortgages explained',
                cy: 'Egluro morgeisi prynu i osod',
              }),
              href: z({
                en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/buy-to-let-mortgages-explained',
                cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/buy-to-let-mortgages-explained',
              }),
            },
            {
              title: z({
                en: 'Homebuyer surveys and costs',
                cy: 'Arolygon a chostau prynwyr tai',
              }),
              href: z({
                en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/a-guide-to-homebuyer-surveys-and-costs',
                cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/a-guide-to-homebuyer-surveys-and-costs',
              }),
            },
            {
              title: z({
                en: 'The cost of buying a house and moving',
                cy: 'Y gost o brynu tŷ a symud',
              }),
              href: z({
                en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/estimate-your-overall-buying-and-moving-costs',
                cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/estimate-your-overall-buying-and-moving-costs',
              }),
            },
          ]}
          isEmbedded={isEmbedded}
        />
      )}
    </div>
  );
};
