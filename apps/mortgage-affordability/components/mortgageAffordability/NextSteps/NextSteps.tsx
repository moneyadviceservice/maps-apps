import { H2 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { resultsContent } from 'data/mortgage-affordability/results';

type Props = {
  riskLevel: 'success' | 'warning';
};

export const NextSteps = ({ riskLevel }: Props) => {
  const { z } = useTranslation();
  const d = resultsContent(z);

  const links = [...d.nextStepsLinks, d.nextStepsRiskLink[riskLevel]];

  return (
    <nav aria-label={d.nextSteps}>
      <H2 className="mb-8 text-blue-700 pt-8">{d.nextSteps}</H2>
      <ul className="list-none p-0 m-0">
        {links.map(({ text, href }, index) => (
          <li
            key={href}
            className={`py-3 border-b border-slate-400${
              index === 0 ? ' border-t border-slate-400' : ''
            }`}
          >
            <Link target="_blank" href={href}>
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
