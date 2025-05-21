import { Heading } from '@maps-react/common/components/Heading';
import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionType } from '../../lib/constants';
import { Row } from './PensionDetailsSection';

type DetailsMobileProps = {
  data: Row[];
  type: PensionType;
};

export const DetailsMobile = ({ data, type }: DetailsMobileProps) => {
  const { t } = useTranslation();

  return (
    <div className="md:hidden mt-14 md:mt-16">
      <Heading
        data-testid="table-section-heading"
        level="h2"
        className="max-md:mb-4 md:text-5xl md:mb-4"
      >
        {t('pages.pension-details.details.title')}
      </Heading>

      <div className="max-md:mb-8 *:border-b-1 *:border-b-slate-400 *:py-2">
        <Heading level="h3" className="font-semibold">
          {t(
            `pages.pension-details.details.${
              type === PensionType.SP ? 'estimate-today' : 'mobile-current'
            }`,
          )}
        </Heading>

        {data.map(({ title, currentValue }) => (
          <div key={title}>
            <div className="font-bold">
              {t(`pages.pension-details.details.${title}`)}
            </div>
            <div data-testid={`current-${title}-mobile`}>{currentValue}</div>
          </div>
        ))}

        <Heading level="h3" className="mt-8 font-semibold">
          {t(
            `pages.pension-details.details.${
              type === PensionType.SP ? 'forecast' : 'mobile-retirement'
            }`,
          )}
        </Heading>

        {data.map(({ title, retirementValue }) => (
          <div key={title}>
            <div className="font-bold">
              {t(`pages.pension-details.details.${title}`)}
            </div>
            <div data-testid={`retirement-${title}-mobile`}>
              {retirementValue}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
