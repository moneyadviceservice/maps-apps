import { Condition, TranslationGroup, TranslationGroupString } from 'types';

import { Button } from '@maps-react/common/components/Button';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';

type ConditionalTitles = {
  title: TranslationGroupString;
  conditions: Condition[];
  conditionOperator?: 'and' | 'or';
};

type Headings = {
  defaultTitle: TranslationGroupString;
  conditionalTitles: ConditionalTitles[];
};

type ConditionalContent = {
  content: TranslationGroup;
  conditions: Condition[];
  conditionOperator?: 'and' | 'or';
};

type Content = {
  defaultContent: TranslationGroup;
  conditionalContent: ConditionalContent[];
};

type Data = {
  headings: Headings;
  content: Content;
};

const headings: Headings = {
  defaultTitle: {
    en: 'In most cases you’ll have a defined benefit pension',
    cy: 'Yn y mwyafrif o achosion bydd gennych bensiwn buddion wedi’u diffinio',
  },
  conditionalTitles: [
    {
      title: {
        en: 'From what you’ve told us you have a defined contribution pension',
        cy: 'O beth rydych wedi’i ddweud wrthym mae gennych bensiwn cyfraniadau wedi’u diffinio',
      },
      conditionOperator: 'or',
      conditions: [
        {
          question: '1', // Was your pension set up by your employer?
          answer: '1', // No
        },
        {
          question: '4', // When did you start this pension?
          answer: '2', // 2001 or later
        },
      ],
    },
    {
      title: {
        en: 'You might have a defined contribution pension',
        cy: 'Efallai bod gennych bensiwn cyfraniadau wedi’u diffinio',
      },
      conditions: [
        {
          question: '4', // When did you start this pension?
          answer: '3', // Don't know
        },
      ],
    },
    {
      title: {
        en: 'In most cases you’ll have a defined contribution pension',
        cy: 'Efallai bod gennych bensiwn cyfraniadau wedi’u diffinio',
      },
      conditionOperator: 'or',
      conditions: [
        {
          question: '3', // Is your pension provider one of the following?
          answer: '0', // Yes
        },
        {
          question: '4', // when did you start this pension?
          answer: '1', // 1996 to 2000
        },
      ],
    },
  ],
};

const content: Content = {
  defaultContent: {
    en: (
      <>
        <Paragraph>
          These are sometimes known as ‘money purchase’ pensions. The amount you
          get depends on how much was paid in and how well the investments have
          done.
        </Paragraph>
        <Paragraph>
          You choose how to take money from your pension pot.
        </Paragraph>
        <Paragraph className="mb-6">
          You can book a free Pension Wise appointment to talk about your
          options for taking your money.
        </Paragraph>
        <Button
          href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-wise/book-a-free-pension-wise-appointment"
          id="pension-appointment-button"
          as="a"
        >
          Book a free appointment
        </Button>
        <Paragraph className="mt-6">
          You can also{' '}
          <Link
            href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-wise/find-out-your-pension-type"
            target="_parent"
          >
            check another pension
          </Link>{' '}
          or{' '}
          <Link
            href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-wise/explore-your-pension-options"
            target="_parent"
          >
            explore your pension options
          </Link>
          .
        </Paragraph>
      </>
    ),
    cy: (
      <>
        <Paragraph>
          Mae’r rhain weithiau’n cael eu hadnabod fel pensiynau ‘prynu arian’.
          Mae’r swm a gewch yn dibynnu ar faint rydych wedi’i dalu i mewn a pha
          mor dda mae eich buddsoddiadau wedi’u gwneud.
        </Paragraph>
        <Paragraph>
          Chi sy’n dewis sut i gymryd arian o’ch cronfa bensiwn.
        </Paragraph>
        <Paragraph>
          Gallwch drefnu apwyntiad Pension Wise am ddim i siarad am eich
          opsiynau ar gyfer cymryd eich arian.
        </Paragraph>
        <Button
          href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-wise/book-a-free-pension-wise-appointment"
          id="pension-appointment-button"
          as="a"
        >
          Trefnu apwyntaid am ddim
        </Button>
        <Paragraph className="mt-6">
          Gallwch hefyd{' '}
          <Link
            href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-wise/find-out-your-pension-type"
            target="_parent"
          >
            wirio pensiwn arall
          </Link>{' '}
          neu{' '}
          <Link
            href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-wise/explore-your-pension-options"
            target="_parent"
          >
            edrych drwy eich opsiynau pensiwn
          </Link>
          .
        </Paragraph>
      </>
    ),
  },
  conditionalContent: [
    {
      content: {
        en: (
          <>
            <Paragraph>
              Pension Wise only gives guidance on defined contribution pensions.
            </Paragraph>
            <Paragraph>
              See our guidance on{' '}
              <Link href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot/pension-investment-options-an-overview">
                pension investment options
              </Link>{' '}
              and the{' '}
              <Link href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/state-pension.html">
                State Pension
              </Link>
              .
            </Paragraph>
            <Paragraph>
              If you have more than one pension, you may also have a defined
              contribution pension –{' '}
              <Link href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-wise/find-out-your-pension-type">
                check another pension
              </Link>
              .
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph>
              Dim ond ar bensiynau cyfraniadau wed’u diffinio y mae Pension Wise
              yn rhoi arweiniad.
            </Paragraph>
            <Paragraph>
              Gweler ein canllaw ar{' '}
              <Link href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/building-your-retirement-pot/pension-investment-options-an-overview">
                opsiynau buddsoddi pensiwn
              </Link>{' '}
              a{' '}
              <Link href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/state-pension.html">
                Phensiwn y Wladwriaeth
              </Link>
              .
            </Paragraph>
            <Paragraph>
              Os oes gennych fwy nag un pensiwn, efallai bod gennych bensiwn
              cyfraniadau wedi’u diffinio hefyd –{' '}
              <Link href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-wise/find-out-your-pension-type">
                gwirio pensiwn arall
              </Link>
              .
            </Paragraph>
          </>
        ),
      },
      conditionOperator: 'or',
      conditions: [
        {
          question: '2', // Did your pension come from working for one of the following...
          answer: '0', // Yes
        },
        {
          question: '4', // When did you start this pension?
          answer: '0', // 1995 or before
        },
      ],
    },
  ],
};

export const data: Data = {
  headings,
  content,
};
