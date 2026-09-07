import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
import { useContextLanguage } from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export const CalloutSection = () => {
  const lang = useContextLanguage();
  const { z } = useTranslation();

  return (
    <UrgentCallout
      variant="arrow"
      className="mt-12 print:hidden"
      border={'teal'}
    >
      <Heading level="h3" className="mb-6 font-semibold">
        {z({
          en: 'Need more information on pensions?',
          cy: 'Angen mwy o wybodaeth am bensiynau?',
        })}
      </Heading>
      <Paragraph>
        {z({
          en: 'One of our pension specialists will be happy to answer your questions. You can:',
          cy: "Bydd un o'n harbenigwyr pensiwn yn hapus i ateb eich cwestiynau:",
        })}
      </Paragraph>

      <ListElement
        variant="unordered"
        items={[
          <Link
            key="webchat"
            href={`https://www.moneyhelper.org.uk/${
              lang === 'en' ? 'PensionsChat' : 'welshchat'
            }`}
          >
            {z({
              en: 'use our webchat',
              cy: `defnyddiwch ein gwe-sgwrsYn.`,
            })}
          </Link>,
          <Paragraph key="call" className="inline">
            {z({
              en: 'Call us on',
              cy: `Ffoniwch ni am ddim ar`,
            })}{' '}
            <Link href="tel:08000113797">0800 011 3797</Link>{' '}
            {z({
              en: "(+44 20 7932 5780 if you're outside the UK)",
              cy: '',
            })}
          </Paragraph>,
          <Link
            key="onlineform"
            href={`https://www.moneyhelper.org.uk/${
              lang === 'en' ? 'PensionsChat' : 'welshchat'
            }`}
          >
            {z({
              en: 'use our online form',
              cy: '',
            })}
          </Link>,
        ]}
        color="blue"
        className="pb-8 pl-4 pr-8 list-inside"
      />

      <Paragraph>
        {z({
          en: "We're open between 9am and 5pm, Monday to Friday. Closed on bank holidays.",
          cy: '',
        })}
      </Paragraph>
      <Paragraph>
        {z({
          en: 'Closed on bank holidays.',
          cy: ``,
        })}
      </Paragraph>
    </UrgentCallout>
  );
};
