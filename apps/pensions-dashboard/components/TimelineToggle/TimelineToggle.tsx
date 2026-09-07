import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { twMerge } from 'tailwind-merge';

import { Link } from '@maps-react/common/components/Link';
import { RadioButton } from '@maps-react/form/components/RadioButton';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown/Markdown';

const radioOptions = [
  {
    id: 'legacy',
    value: 'legacy',
  },
  {
    id: 'alternative',
    value: 'alternative',
  },
];

export const TimelineToggle = ({
  selectedOption,
}: {
  selectedOption: string;
}) => {
  const { t, locale } = useTranslation();
  const router = useRouter();

  const [jsEnabled, setJsEnabled] = useState(false);
  const [selected, setSelected] = useState(selectedOption);

  const handleChange = (value: string) => {
    setSelected(value);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, income: value },
    });
  };

  useEffect(() => {
    setJsEnabled(true);
  }, []);

  return (
    <div
      data-testid="timeline-toggle"
      className="lg:w-[84%] xl:w-[67%] 2xl:w-[58%] mb-9 lg:mb-2"
    >
      <Markdown
        testId="timeline-toggle-intro"
        content={t('components.timeline-toggle.intro')}
      />

      {jsEnabled ? (
        <div
          data-testid="timeline-toggle-options"
          className="mt-4 md:flex md:flex-row md:gap-11"
        >
          {radioOptions.map((option, index) => (
            <div key={option.id}>
              <RadioButton
                id={option.id}
                name="income-type"
                value={option.value}
                checked={selected === option.value}
                onChange={() => handleChange(option.value)}
                testId={`timeline-toggle-option-${option.value}`}
                radioInputTestId={`timeline-toggle-option-${option.value}-radio`}
              >
                {t(`components.timeline-toggle.${option.value}`)}{' '}
                {t('components.timeline-toggle.option')}
              </RadioButton>
              {index === 0 && (
                <span className="inline-block my-4 ml-2 md:hidden">
                  {t('common.or')}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div data-testid="timeline-toggle-links">
          <p className="sr-only">
            {t('components.timeline-toggle.current')}:{' '}
            {t(`components.timeline-toggle.${selectedOption}`)}
          </p>
          {t('components.timeline-toggle.view-by')}{' '}
          <ul className="inline-block ml-6 leading-6 md:ml-6">
            {radioOptions.map((option, index) => (
              <li
                className={twMerge(
                  `inline-block ${
                    index === 0 && 'border-r-1 border-gray-450 pr-4 mr-4'
                  }`,
                )}
                key={option.id}
              >
                {selectedOption === option.value ? (
                  <span className="font-bold text-blue-700">
                    {t(`components.timeline-toggle.${option.value}`)}
                  </span>
                ) : (
                  <Link
                    href={`/${locale}/your-pensions-timeline?income=${option.value}`}
                  >
                    {t(`components.timeline-toggle.${option.value}`)}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
