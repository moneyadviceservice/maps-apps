import { H2, H3 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { nextStepsData } from '../../data/fuel-finder';

const NextSteps = () => {
  const { z } = useTranslation();

  return (
    <div className="mt-6 lg:mt-8">
      <H2 className="text-blue-700 mb-6">
        {z({ en: 'Next steps', cy: 'Camau nesaf' })}
      </H2>
      <ol className="list-none space-y-8 [&>li]:block">
        {nextStepsData.map((step, index) => (
          <li key={index}>
            <H3 className="mb-2 list-item list-decimal ml-10 md:ml-14 marker:font-bold marker:text-3xl marker:md:text-5xl marker:text-gray-800">
              {z(step.heading)}
            </H3>
            <Paragraph>{z(step.content)}</Paragraph>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default NextSteps;
