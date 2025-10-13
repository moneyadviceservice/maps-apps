import { ReactNode } from 'react';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

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
        <Paragraph className="mb-8">
          Need help?{' '}
          <Link
            asInlineText
            href="https://www.moneyhelper.org.uk/en/pensions-chat"
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
            asInlineText
            href="https://www.moneyhelper.org.uk/cy/pensions-chat"
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
        en: 'Need more information on pensions?',
        cy: 'Angen mwy o wybodaeth am bensiynau?',
      }),
      content1: z({
        en: (
          <>
            <Paragraph>
              Call our helpline free on{' '}
              <Link href="tel:08000113797">0800 011 3797</Link> or{' '}
              <Link href="https://www.moneyhelper.org.uk/en/pensions-chat">
                use our webchat
              </Link>{' '}
              . One of our pension specialists will be happy to answer your
              questions.
            </Paragraph>
            <Paragraph>
              Our help is impartial and free to use, whether that’s online or
              over the phone.
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph>
              Ffoniwch ni am ddim ar{' '}
              <Link href="tel:08007561012">0800 756 1012</Link> neu{' '}
              <Link href="https://www.moneyhelper.org.uk/cy/pensions-chat">
                defnyddiwch ein gwe-sgwrs
              </Link>
              . Bydd un o’n harbenigwyr pensiwn yn hapus i ateb eich cwestiynau.
            </Paragraph>
            <Paragraph>
              Mae ein help yn ddiduedd ac am ddim i’w ddefnyddio, p’un ai yw
              hynny ar-lein neu dros y ffôn.
            </Paragraph>
          </>
        ),
      }),
      content2: z({
        en: 'Opening times: Monday to Friday: 9am to 5pm. Closed on bank holidays.',
        cy: 'Amseroedd agor: Dydd Llun i Ddydd Gwener, 9am i 5pm. Ar gau ar wyliau banc.',
      }),
    },
  };
};
