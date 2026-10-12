import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { PhoneNumber } from '../../lib/types';

type PhoneNumberProps = {
  tel: PhoneNumber;
};

const usageMapping: { [key: string]: string } = {
  M: 'common.contact.telephone-main',
  S: 'common.contact.telephone-textphone',
  W: 'common.contact.telephone-welsh-language',
  N: 'common.contact.telephone-outside-uk',
  A: 'common.contact.telephone-whatsapp',
};

export const TelephoneNumber = ({ tel }: PhoneNumberProps) => {
  const { t } = useTranslation();

  const translationKey = usageMapping[tel.usage[0]];

  return (
    <>
      {t(translationKey)}:{' '}
      <Link href={`tel:${tel.number}`} asInlineText>
        {tel.number}
      </Link>
    </>
  );
};
