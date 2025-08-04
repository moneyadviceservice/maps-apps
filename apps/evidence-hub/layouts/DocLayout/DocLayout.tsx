import { Breadcrumbs } from 'components/Breadcrumbs';
import { ContentSection } from 'components/ContentSection';
import { DocContents } from 'components/DocContents';
import { EvidenceType } from 'components/EvidenceType';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header';
import { KeyInfo } from 'components/KeyInfo';

import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';

export const DocLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Container className="max-w-[1272px]" data-testid="container">
          <Breadcrumbs />

          <Heading
            level={'h1'}
            className="my-6 text-blue-800 max-w-[812px]"
            data-testid="main-heading"
          >
            Funding and operating models of the debt advice sector
          </Heading>

          <EvidenceType />

          <div className="md:flex">
            <div className={'mb-8 md:mb-16 md:w-2/3'}>
              <DocContents />

              <ContentSection
                heading={'Context'}
                content={
                  <Paragraph>
                    One of the goals of the UK Strategy for Financial Wellbeing
                    is that two million more people who need debt advice will be
                    accessing such services by 2030. MaPS has a considerable
                    evidence base relating to debt advice customers. However,
                    most of this relates to the pre-pandemic environment and
                    before the recent increases in the cost of living. These
                    changes to the economy and society will have an impact on
                    the cohorts of people seeking debt advice and how it will
                    need to be delivered. MaPS is seeking to build more
                    up-to-date evidence through independent insight gathered via
                    research projects. This report is designed to support
                    MaPS&apos;s decision making for future rounds of debt advice
                    commissioning. It sets out key themes and challenges facing
                    debt advice providers and suggests some areas of
                    consideration to prompt debate and discussion ahead of the
                    any commercial activity.
                  </Paragraph>
                }
              />

              <ContentSection
                heading={'The study'}
                content={
                  <>
                    <Paragraph>
                      The study was primarily qualitative and used a combination
                      of semi-structured interviews and observations as the main
                      insight-gathering activities. A rigorous planning process
                      led to a statement of key lines of enquiry, which in turn
                      shaped the insight capture process and the desired
                      participant base.
                    </Paragraph>
                    <Paragraph>
                      The interviews comprised 15 Local Authorities, five
                      Housing Associations, Central and devolved government
                      bodies and relevant agencies and ten providers
                      (representing different delivery models) and were carried
                      out by interviewers who were subject matter experts. The
                      stakeholder participants were drawn from across the UK to
                      ensure that the research was geographically
                      representative.
                    </Paragraph>
                    <Paragraph>
                      The blend of stakeholders evolved as the research
                      progressed due to challenges in engaging with some
                      stakeholders and the identification of additional
                      stakeholders with the potential to add further insight to
                      the research.
                    </Paragraph>
                    <Paragraph>
                      The research was commissioned by MaPS and conducted by
                      consultancy company 40C.
                    </Paragraph>
                  </>
                }
              />

              <ContentSection
                heading={'Points to consider'}
                content={
                  <>
                    <Paragraph>
                      The report explores insight, learning and considerations
                      across four themes:
                    </Paragraph>
                    <Paragraph>
                      <span className="font-bold">
                        Theme 1: Funding sources and pressures on funding for
                        debt advice.
                      </span>{' '}
                      The sector&apos;s funding is perceived to be under
                      pressure and there are some material gaps in funding which
                      hold providers back from growing, innovating, and offering
                      a holistic service.
                    </Paragraph>
                    <Paragraph>
                      <span className="font-bold">
                        Theme 2: Lack of consistent operating models across the
                        sector to base a service offer against.
                      </span>{' '}
                      As demand and complexity grow, there are challenges to
                      integrating debt advice alongside other specialist support
                      services to develop effective, holistic approaches.
                    </Paragraph>
                    <Paragraph>
                      <span className="font-bold">
                        Theme 3: Client needs do not always align with a narrow
                        interpretation of debt advice.
                      </span>{' '}
                      In most cases, the needs of people are broader than debt
                      advice alone and MaPS can consider this in its funding
                      approach. To work most effectively with stakeholders,
                      there is also a need to reaffirm knowledge and awareness
                      of MaPS&apos; role, its current strategy for funded debt
                      advice, and its longer term aims.
                    </Paragraph>
                    <Paragraph>
                      <span className="font-bold">
                        Theme 4: The approach used in the commissioning exercise
                        launched in Summer 2021 was not closely aligned with the
                        current capabilities and priorities in the debt advice
                        sector.
                      </span>{' '}
                      There are opportunities for MaPS to use approaches which
                      have a closer fit to the current sector landscape and/or
                      explore alternative approaches while carrying out
                      iterative improvement activities which drive sector
                      development
                    </Paragraph>
                  </>
                }
              />

              <ContentSection
                heading={'Key findings'}
                content={
                  <ul className="list-disc pl-8 space-y-6">
                    <li>
                      <span className="font-bold">
                        Methodological strengths/weaknesses:
                      </span>{' '}
                      The report notes some limitations that resulted from
                      having a short engagement and delivery period, namely that
                      some of the organisations identified for the research did
                      not respond or declined. This was mitigated by inviting
                      other stakeholders. Another limitation was the lack of
                      data on funding, particularly in England.
                    </li>
                    <li>
                      <span className="font-bold">Applicability:</span> Of
                      interest to debt advice organisations, local and central
                      government, as well as to those funding debt advice and
                      any stakeholders, such as creditors, interested in helping
                      customers access debt advice.
                    </li>
                    <li>
                      <span className="font-bold">Relevance:</span> Highly
                      relevant given the cost-of-living crisis and the
                      likelihood of more people falling into debt and requiring
                      debt advice.
                    </li>
                    <li>
                      <span className="font-bold">Generalisability:</span> The
                      research is specific to funding and provision of debt
                      advice in the UK.
                    </li>
                  </ul>
                }
              />
            </div>
            <div className="mb-16 md:w-1/3">
              <KeyInfo />
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
};
