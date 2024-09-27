import {
  babyMoneyTimelineDate,
  landingContent,
} from 'data/baby-money-timeline/landing';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Button, Icon, IconType, Link } from '@maps-digital/shared/ui';
import { Container } from '@maps-react/core/components/Container';
import { Select } from 'components/Select';

type Props = {
  lang: string;
  isEmbed: boolean;
};

const BabyMoneyTimelineLanding = ({ lang, isEmbed }: Props) => {
  const { z } = useTranslation();
  const { intro } = landingContent(z);
  const dateInputs = babyMoneyTimelineDate(z);

  return (
    <Container className="md:-mt-8">
      <div className="lg:max-w-[860px]">
        <Link
          href={{
            pathname: `/${lang}/baby-money-timeline`,
          }}
        >
          <Icon type={IconType.CHEVRON_LEFT} />
          {z({ en: 'Back', cy: 'Yn ôl' })}
        </Link>
        <div className="mt-8">{intro}</div>

        <form
          action={`/${lang}/baby-money-timeline/1`}
          id={'baby-money-timeline'}
        >
          <fieldset className="sm:flex gap-6 my-8" role="group">
            {dateInputs.map((item) => (
              <div key={item.name}>
                <label
                  htmlFor={item.id}
                  className="mb-2 mt-2 md:mt-0 inline-flex text-lg"
                >
                  {item.label}
                </label>
                <Select
                  hideEmptyItem={true}
                  aria-required={true}
                  selectClassName="h-[49px]"
                  id={item.id}
                  name={item.name}
                  defaultValue={item.defaultValue}
                  options={item.options}
                  aria-label={item.ariaLabel}
                />
              </div>
            ))}
          </fieldset>

          <Button
            className={'md:my-8'}
            variant="primary"
            id={'continue'}
            type="submit"
            form="baby-money-timeline"
          >
            {z({ en: 'Continue', cy: 'Parhau' })}
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default BabyMoneyTimelineLanding;
