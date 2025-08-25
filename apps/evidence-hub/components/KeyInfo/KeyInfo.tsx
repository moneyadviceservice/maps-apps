import { PropsWithChildren } from 'react';

import { Heading } from '@maps-react/common/components/Heading';

const KeySection = ({ children }: PropsWithChildren) => (
  <section className="mb-4">{children}</section>
);

const Title = ({ children }: PropsWithChildren) => (
  <div>
    <span className="font-bold">{children}</span>
  </div>
);

export const KeyInfo = () => (
  <aside className="md:pl-20" data-testid="key-info">
    <Heading
      level={'h4'}
      component={'h2'}
      className="mb-4"
      data-testid="heading"
    >
      Key Info
    </Heading>
    <KeySection>
      <Title>Client Group</Title>
      <ul className="list-disc pl-8">
        <li>Other</li>
      </ul>
    </KeySection>
    <KeySection>
      <Title>Topics</Title>
      <ul className="list-disc pl-8">
        <li>Credit Use and Debt</li>
      </ul>
    </KeySection>
    <KeySection>
      <Title>Country/Countries</Title>
      <ul className="list-disc pl-8">
        <li>United Kingdom</li>
      </ul>
    </KeySection>
    <KeySection>
      <Title>Year of publication</Title>
      <span>2023</span>
    </KeySection>
    <KeySection>
      <Title>Last updated</Title>
      <span>01 July 2023</span>
    </KeySection>
    <KeySection>
      <Title>Links to other information</Title> Funding and perating of the debt
      advice sector
    </KeySection>
    <KeySection>
      <Title>Contact information</Title>
      <span>
        Dr Raffaella Calabrese, Yujia Chen and Dr Lynne Robertson-Rose,
        University of Edinburgh
      </span>
    </KeySection>
  </aside>
);
