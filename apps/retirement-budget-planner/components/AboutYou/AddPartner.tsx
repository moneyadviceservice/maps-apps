import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import useTranslation from '@maps-react/hooks/useTranslation';

type AddPartnerProps = {
  onAdd: () => void;
};
export const AddPartner = ({ onAdd }: AddPartnerProps) => {
  const { t } = useTranslation();
  return (
    <section className="py-6 mb-4 border-t border-b border-gray-400">
      <Heading level="h5" className="py-2">
        {t('aboutYou.addPartner.title')}
      </Heading>
      <Button
        name="action"
        className="h-10 py-6"
        variant="secondary"
        type="submit"
        value="add"
        onClick={(e) => {
          e.preventDefault();
          onAdd();
        }}
        formAction="/api/about-you"
      >
        {t('aboutYou.addPartner.buttonLabel')}
        <Icon type={IconType.CHEVRON_RIGHT} />
      </Button>
    </section>
  );
};
