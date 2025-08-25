import countryCodeLookup from 'country-code-lookup';

import { PostalAddress } from '../../lib/types';

export type AddressProps = {
  address: PostalAddress;
  preferred?: boolean;
};

export const Address = ({ address, preferred }: AddressProps) => {
  const country = countryCodeLookup.byIso(address.countryCode);
  return (
    <>
      <p>
        {preferred && '(preferred) '}
        {address.postalName}
      </p>
      <p>{address.line1}</p>
      {address.line2 && <p>{address.line2}</p>}
      {address.line3 && <p>{address.line3}</p>}
      {address.line4 && <p>{address.line4}</p>}
      {address.line5 && <p>{address.line5}</p>}
      <p>{address.postcode}</p>
      {country && <p>{country.country}</p>}
    </>
  );
};
