import { Paragraph, Link } from '@maps-digital/shared/ui';
import { useTranslation } from '@maps-digital/shared/hooks';
import { ReactNode } from 'react';

interface BottomContent {
  liveChatLink: ReactNode;
  urgentCallout: {
    heading: string;
    content1: ReactNode;
    content2: string;
  };
}

export const bottomContentText = (
  z: ReturnType<typeof useTranslation>['z'],
): BottomContent => {
  return {
    liveChatLink: z({
      en: (
        <Paragraph>
          Need help?{' '}
          <Link
            href="https://www.moneyhelper.org.uk/pensionschat"
            target="_blank"
            className="my-4 pb-4"
          >
            Live chat with our specialists
          </Link>
        </Paragraph>
      ),
      cy: (
        <Paragraph>
          <Link
            href="https://www.moneyhelper.org.uk/welshchat"
            target="_blank"
            className="my-4 pb-4"
          >
            Darganfod eich math o bensiwn
          </Link>
        </Paragraph>
      ),
    }),
    urgentCallout: {
      heading: z({
        en: 'Under 50, not sure what pension you have, or just not ready?',
        cy: 'O dan 50, ddim yn siwr pa bensiwn sydd gennych, neu ddim yn barod?',
      }),
      content1: z({
        en: (
          <Paragraph>
            We can still answer your questions. Call us free on{' '}
            <Link href="tel:08000223797">0800 011 3797</Link> or{' '}
            <Link href="https://www.moneyhelper.org.uk/pensionschat">
              use our webchat
            </Link>{' '}
            in a new window. One of our pension specialists will be happy to
            help.
          </Paragraph>
        ),
        cy: (
          <Paragraph>
            Gallwn ateb eich cwestiynau o hyd. Ffoniwch ni am ddim ar{' '}
            <Link href="tel:08000223797">0800 011 3797</Link> neu{' '}
            <Link href="https://www.moneyhelper.org.uk/welshchat">
              ddefnyddio ein gwe-sgwrs
            </Link>
            . Bydd un o’n harbenigwyr pensiynau yn hapus i helpu.
          </Paragraph>
        ),
      }),
      content2: z({
        en: 'Opening times: Monday to Friday: 9am to 5pm. Closed on bank holidays.',
        cy: 'Oriau Agor: Dydd Llun i ddydd Gwener: 9am i 5pm. Ar gau ar wyliau banc.',
      }),
    },
  };
};
