import { Organisation } from 'types/Organisations';

import { deliveryChannel } from '../../../../data/form-data/delivery_channel';
import { geoRegions } from '../../../../data/form-data/geo_regions';
import { organisationTypes } from '../../../../data/form-data/organisation_types';
import { formatKeyTitleArrays } from '../formatKeyTitleArrays';
import { formatOrganisationMembership } from '../formatOrganisationMembership';
import { formatOrganisationType } from '../formatOrganisationType';

export const organisationFormObject = (formData: FormData) => {
  const geo_regions = formatKeyTitleArrays(formData, geoRegions);
  const delivery_channel = formatKeyTitleArrays(formData, deliveryChannel);
  const organisation_types = formatOrganisationType(
    formData,
    organisationTypes,
  );
  const fca = {
    fca_registered: `${formData.get('fca_registered')}`,
    fca_number: `${formData.get('fca_number')}`,
  };
  const organisation_membership = formatOrganisationMembership(formData);

  const payload: Partial<Organisation> = {
    name: `${formData.get('name')}`,
    email: `${formData.get('email')}`,
    address: `${formData.get('address')}`,
    geo_regions: geo_regions ?? [],
    delivery_channel: delivery_channel ?? [],
    type: organisation_types ?? { title: '' },
    fca: fca,
    organisation_membership: organisation_membership,
    usage: {
      launch_date: `${formData.get('launch_date')}`,
      management_software_used: `${formData.get('management_software_used')}`,
      intended_use: `${formData.get('intended_use')}`,
      other_use: `${formData.get('other_use')}`,
    },
    website: `${formData.get('website')}`,
  };

  return payload;
};
