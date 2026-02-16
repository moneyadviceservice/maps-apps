import { Link } from '@maps-react/common/components/Link';

import { PhoneNumber } from '../../lib/types';

const usageMapping: { [key: string]: string } = {
  M: 'Main telephone',
  S: 'Textphone',
  W: 'Welsh language',
  N: 'Outside UK',
  A: 'WhatsApp',
};

type PhoneNumberProps = {
  tel: PhoneNumber;
};

export const TelephoneNumber = ({ tel }: PhoneNumberProps) => {
  return (
    <>
      {usageMapping[tel.usage[0]]}:{' '}
      <Link href={`tel:${tel.number}`} asInlineText>
        {tel.number}
      </Link>
    </>
  );
};
