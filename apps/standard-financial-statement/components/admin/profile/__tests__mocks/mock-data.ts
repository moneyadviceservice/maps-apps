import { Organisation } from '../../../../types/Organisations';

export const baseMockData: Organisation = {
  id: '1',
  type: { title: '', type_other: '' },
  name: '',
  sfs_live: true,
  licence_status: 'Pending',
  licence_number: 'ABC123',
  organisation_membership: [],
  fca: { fca_number: '' },
  geo_regions: [],
  users: [],
  created: '',
  modified: '',
};
