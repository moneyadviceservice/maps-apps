import { FormType } from 'data/form-data/org_signup';
import { Entry } from 'lib/types';
import { render } from '@testing-library/react';

import SignUpOrg from './SignUpOrg';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => () => ({
  z: ({ en }: { en: string; cy: string }) => en,
}));

const errorFields = [
  'organisationName',
  'organisationWebsite',
  'organisationStreet',
  'organisationCity',
  'organisationPostcode',
  'sfsLaunchDate',
  'geoRegions',
  'sfslive',
  'organisationUse',
  'fcaReg',
  'debtAdviceOther',
  'fcaRegNumber',
  'memberships',
  'organisationType',
].map((key) => ({
  field: key,
  type: 'too_small',
}));

const mockEntry: Entry = {
  data: {
    lang: 'en',
    flow: FormType.NEW_ORG,
    organisationName: '',
    organisationWebsite: '',
    organisationStreet: '',
    organisationCity: '',
    organisationPostcode: '',
    sfsLaunchDate: '',
    caseManagementSoftware: '',
    geoRegions: [],
    sfslive: '',
    organisationUse: '',
    fcaReg: '',
  },
  errors: [],
};

describe('SignUpOrg', () => {
  it('renders correctly', () => {
    const { container } = render(
      <SignUpOrg
        lang="en"
        onSubmit={jest.fn()}
        entry={{
          data: {
            lang: 'en',
          },
          errors: [],
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with errors', () => {
    const { container } = render(
      <SignUpOrg
        onSubmit={jest.fn()}
        entry={{
          ...mockEntry,
          errors: errorFields,
        }}
        lang="en"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly conditional inputs', () => {
    const { container } = render(
      <SignUpOrg
        onSubmit={jest.fn()}
        entry={{
          ...mockEntry,
          data: {
            ...mockEntry.data,
            organisationName: 'Test Organisation',
            organisationWebsite: 'https://example.com',
            organisationStreet: '123 Test St',
            organisationCity: 'Test City',
            organisationPostcode: '12345',
            sfsLaunchDate: '2023-01-01',
            caseManagementSoftware: 'Test',
            geoRegions: ['north-east'],
            organisationType: 'other',
            memberships: ['advice-ni'],
          },
        }}
        lang="en"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly conditional inputs errors', () => {
    const { container } = render(
      <SignUpOrg
        onSubmit={jest.fn()}
        entry={{
          data: {
            lang: 'en',
            organisationName: '',
            organisationWebsite: '',
            organisationStreet: '',
            organisationCity: '',
            organisationPostcode: '',
            debtAdvice: ['face-to-face', 'other'],
            sfsLaunchDate: '',
            geoRegions: [],
            sfslive: '',
            organisationUse: '',
            fcaReg: 'fca-yes',
            memberships: [],
            debtAdviceOther: '',
            fcaRegNumber: '',
          },
          errors: errorFields,
        }}
        lang="en"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
