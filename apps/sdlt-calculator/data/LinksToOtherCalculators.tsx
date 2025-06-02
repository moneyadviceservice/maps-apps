import useTranslation from '@maps-react/hooks/useTranslation';

import { LinkList } from '../components/LinkList';

interface LinksToOtherCalculatorsProps {
  isEmbedded?: boolean;
}

export const LinksToOtherCalculators = ({
  isEmbedded,
}: LinksToOtherCalculatorsProps) => {
  const { z } = useTranslation();

  const title = z({
    en: 'Buying in Scotland or Wales?',
    cy: 'Prynu yn yr Alban neu Cymru?',
  });
  const description = z({
    en: 'The Scottish and Welsh equivalents of the Stamp Duty Land Tax (SDLT) paid in England and Northern Ireland is the Land and Buildings Transaction Tax (LBTT) in Scotland the Land Transaction Tax (LTT) in Wales.',
    cy: "Yng Nghymru a'r Alban, yr hyn sy'n cyfateb i Dreth Dir y Dreth Stamp (SDLT) a delir yn Lloegr a Gogledd Iwerddon, yw'r Dreth Trafodion Tir yng Nghymru (LTT) a'r Dreth Trafodion Tir ac Adeiladau (LBTT) yn yr Alban.",
  });

  return (
    <LinkList
      title={title}
      description={description}
      isEmbedded={isEmbedded}
      links={[
        {
          title: z({
            en: 'Calculate Land and Buildings Transaction Tax for Scotland',
            cy: 'Cyfrifwch Dreth Trafodiadau Tir ac Adeiladau ar gyfer yr Alban',
          }),
          href: z({
            en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/land-and-buildings-transaction-tax-calculator-scotland',
            cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/land-and-buildings-transaction-tax-calculator-scotland',
          }),
        },
        {
          title: z({
            en: 'Calculate Land Transaction Tax for Wales',
            cy: 'Cyfrifwch Dreth Trafodiadau Tir ar gyfer Cymru',
          }),
          href: z({
            en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/land-transaction-tax-calculator-wales',
            cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/land-transaction-tax-calculator-wales',
          }),
        },
      ]}
    />
  );
};
