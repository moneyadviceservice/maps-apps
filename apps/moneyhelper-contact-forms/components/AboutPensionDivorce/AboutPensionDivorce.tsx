import { ListElement } from '@maps-digital/shared/ui';

import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { StepComponent } from '../../lib/types';
import { FormWrapper } from '../FormWrapper';

export const AboutPensionDivorce: StepComponent = ({ step }) => {
  const { t, tList } = useTranslation();

  const list = tList('components.about-pension-divorce.items');

  return (
    <>
      <Paragraph className="mb-6" data-testid="about-pension-divorce-content">
        {t('components.about-pension-divorce.content')}
      </Paragraph>
      <ListElement
        items={list.map((item: string) => (
          <Markdown key={item.slice(0, 8)} content={item} />
        ))}
        variant="unordered"
        color="dark"
        className="ml-8"
        data-testid="about-pension-divorce-list"
      />
      <FormWrapper step={step}></FormWrapper>
    </>
  );
};
