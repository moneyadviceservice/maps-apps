import BenefitsCalculator from 'public/images/teaser-card-images/benefits-calculator.png';
import BillPrioritiser from 'public/images/teaser-card-images/bill-prioritiser.png';
import BudgetPlanner from 'public/images/teaser-card-images/budget-planner.png';

import { H2 } from '@maps-react/common/components/Heading';
import { TeaserCard } from '@maps-react/common/components/TeaserCard';
import { TeaserCardContainer } from '@maps-react/common/components/TeaserCardContainer/TeaserCardContainer';
import useLanguage from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { otherToolsData } from '../../data/fuel-finder';

const OtherTools = () => {
  const { z } = useTranslation();
  const lang = useLanguage();

  const tools = otherToolsData(z, lang, {
    budgetPlanner: BudgetPlanner,
    billPrioritiser: BillPrioritiser,
    benefitsCalculator: BenefitsCalculator,
  });

  return (
    <div className="mt-6 lg:mt-8">
      <H2 className="text-blue-700 mb-6">
        {z({
          en: 'Other tools to try',
          cy: 'Teclynnau eraill i roi cynnig arnynt',
        })}
      </H2>
      <TeaserCardContainer gridCols={3}>
        {tools.map((tool) => (
          <TeaserCard
            key={tool.title}
            title={tool.title}
            description={tool.description}
            href={tool.href}
            image={tool.image}
            imageClassName="h-52"
            headingLevel="h6"
            headingComponent="h2"
          />
        ))}
      </TeaserCardContainer>
    </div>
  );
};

export default OtherTools;
