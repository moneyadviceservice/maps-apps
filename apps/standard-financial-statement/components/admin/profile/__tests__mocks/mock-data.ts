import { Organisation } from '../../../../types/Organisations';

export const baseMockData: Organisation = {
  id: '1',
  uuid: 'mock-uuid-123',
  type: { title: '', type_other: '' },
  name: '',
  sfs_live: 1,
  licence_status: 'Pending',
  licence_number: 'ABC123',
  organisation_membership: [],
  fca: { fca_number: '' },
  geo_regions: [],
  users: [],
  created: '',
  modified: '',
};
