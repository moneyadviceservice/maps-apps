import { Link } from '@maps-react/common/components/Link';

import { ContactMethod } from '../../lib/types';
import { formatPhoneNumber } from '../../lib/utils';
import { Address } from '../Address';

type PreferredProps = {
  contactMethods: ContactMethod[];
};

export const PreferredContacts = ({ contactMethods }: PreferredProps) => {
  return contactMethods.map((method, idx) => {
    if (method.preferred) {
      if ('email' in method.contactMethodDetails) {
        return <div key={idx}>Email: {method.contactMethodDetails.email}</div>;
      } else if ('number' in method.contactMethodDetails) {
        return (
          <div key={idx}>{formatPhoneNumber(method.contactMethodDetails)}</div>
        );
      } else if ('postalName' in method.contactMethodDetails) {
        const address = method.contactMethodDetails;
        return (
          <div key={idx}>
            <Address address={address} />
          </div>
        );
      } else if ('url' in method.contactMethodDetails) {
        return (
          <div key={idx}>
            Website:{' '}
            <Link
              asInlineText
              target="_blank"
              href={method.contactMethodDetails.url}
            >
              {method.contactMethodDetails.url}
            </Link>
          </div>
        );
      }
    }
  });
};
