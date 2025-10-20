import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
export const RBPInformationCallout = () => (
  <UrgentCallout
    data-testid="rbp-callout"
    border="teal"
    variant="arrow"
    className="mt-12"
  >
    <div className="md:flex">
      <div>
        <Heading level="h3" className="mb-6 font-semibold">
          Need more information on pensions?
        </Heading>
        <Paragraph>
          Call our helpline free on{' '}
          <Link href="tel:08000113797">0800 011 3797</Link> or{' '}
          <Link href="https://www.moneyhelper.org.uk/en/pensions-chat">
            use our webchat
          </Link>{' '}
          One of our pension specialists will be happy to answer your questions.
        </Paragraph>
        <Paragraph>
          Our help is impartial and free to use, whether that’s online or over
          the phone.
        </Paragraph>
        <Paragraph>
          Opening times: Monday to Friday, 9am to 5pm. Closed on bank holidays.
        </Paragraph>
      </div>
    </div>
  </UrgentCallout>
);
