import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';

export const HowRBPWorks = () => (
  <section data-testid="how-rbp-works">
    <Heading level="h2" variant="secondary" className="text-[38px] mb-8 mt-2">
      How our Retirement budget planner works
    </Heading>
    <Paragraph>
      Our Retirement budget planner compares your income to your outgoings and
      calculates if you’ll have any money left over.
    </Paragraph>
    <Paragraph>
      You’ll also see a breakdown of where you spend your money to help identify
      if you can cut costs.
    </Paragraph>
    <Paragraph>The information you’ll need</Paragraph>
    <Paragraph className="font-bold"> You’ll be asked to enter:</Paragraph>
    <ListElement
      items={[
        'the age you would like to retire.',
        'your current income.',
        'how much you spend, including household bills and paying into your pension.',
        'an email address if you wish to save and come back later. ',
      ]}
      color="blue"
      variant="unordered"
      className="pb-8 pl-2 text-sm list-inside "
    />
    <Paragraph>
      You can create a household budget by adding these details for another
      person.
    </Paragraph>
    <Link
      data-testid="rbp-link-from-how-it-works"
      className="my-4"
      asButtonVariant="primary"
      id="submit"
      href="/about-you"
    >
      Start Retirement Budget Planner
    </Link>
    <Paragraph className="pt-4 pb-8">
      It should take about five minutes to complete.
    </Paragraph>
  </section>
);
