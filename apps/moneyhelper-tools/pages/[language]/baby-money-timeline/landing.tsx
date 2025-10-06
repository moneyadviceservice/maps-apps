import {
  babyMoneyTimelineDate,
  landingContent,
} from 'data/baby-money-timeline/landing';
import { twMerge } from 'tailwind-merge';
import { UrlPath } from 'types';

import { Button } from '@maps-react/common/components/Button';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Container } from '@maps-react/core/components/Container';
import { Select } from '@maps-react/form/components/Select/Select';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

type Props = {
  lang: string;
  queryData: DataFromQuery;
  isEmbed: boolean;
};

const BabyMoneyTimelineLanding = ({ lang, isEmbed, queryData = {} }: Props) => {
  const { z } = useTranslation();
  const { intro } = landingContent(z);
  const dateInputs = babyMoneyTimelineDate(z);

  return (
    <Container className="-mt-4">
      <div className="lg:max-w-[860px]">
        {!isEmbed && (
          <Link
            href={`https://www.moneyhelper.org.uk/${lang}/family-and-care/becoming-a-parent/baby-money-timeline`}
          >
            <Icon type={IconType.CHEVRON_LEFT} />
            {z({ en: 'Back', cy: 'Yn ôl' })}
          </Link>
        )}
        <div className="mt-8">{intro}</div>
        <form
          action={`/${lang}/${UrlPath.BabyMoneyTimeline}/1`}
          id={UrlPath.BabyMoneyTimeline}
        >
          {isEmbed && <input type="hidden" name="isEmbedded" value="true" />}
          <fieldset className="flex flex-wrap gap-6 my-8" role="group">
            {dateInputs.map((item, index) => {
              const inputWidth = [
                'md:max-w-[124px]',
                'md:max-w-[194px]',
                'md:max-w-[154px]',
              ];
              return (
                <div
                  key={item.name}
                  className={twMerge(['w-full', inputWidth[index]])}
                >
                  <label
                    htmlFor={item.id}
                    className="mt-2 mb-2 text-lg md:mt-0"
                  >
                    {item.label}
                  </label>
                  <Select
                    hideEmptyItem={true}
                    aria-required={true}
                    selectClassName={twMerge(['h-[49px]'])}
                    id={item.id}
                    name={item.name}
                    defaultValue={
                      queryData[`${item.name}`] ?? item.defaultValue
                    }
                    options={item.options}
                    aria-label={item.ariaLabel}
                  />
                </div>
              );
            })}
          </fieldset>

          <Button
            className={'md:my-8'}
            variant="primary"
            id={'continue'}
            type="submit"
            form={UrlPath.BabyMoneyTimeline}
          >
            {z({ en: 'Continue', cy: 'Parhau' })}
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default BabyMoneyTimelineLanding;
