import { FormType } from 'data/form-data/org_signup';
import { Entry } from 'lib/types';
import { fireEvent, render } from '@testing-library/react';

import SignUpOrg from './SignUpOrg';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => () => ({
  z: ({ en }: { en: string; cy: string }) => en,
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

const mockSubmit = jest.fn();

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

const mockMembership = [
  {
    key: 'advice-ni',
    en: 'Advice NI',
    cy: 'Cyngor NI',
  },
  {
    key: 'advice-uk',
    en: 'Advice UK',
    cy: 'Cyngor DU',
  },
  {
    key: 'citizens-advice',
    en: 'Citizens Advice',
    cy: 'Cyngor y Bobl',
  },
  {
    key: 'other',
    en: 'Other (please specify below)',
    cy: 'Arall (Nodwch isod osod)',
  },
];

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

  it('renders memberships checkboxes and has correct functionlity', async () => {
    const { getByTestId, findByTestId } = render(
      <SignUpOrg
        onSubmit={mockSubmit}
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
            memberships: mockMembership as unknown as string[],
            debtAdviceOther: '',
            fcaRegNumber: '',
          },
          errors: errorFields,
        }}
        lang="en"
      />,
    );

    const aCheckbox = getByTestId('advice-uk');
    const bCheckbox = getByTestId('citizens-advice');
    const oCheckbox = getByTestId('other');

    expect(aCheckbox).toBeInTheDocument();
    expect(bCheckbox).toBeInTheDocument();
    expect(aCheckbox).not.toBeChecked();
    expect(bCheckbox).not.toBeChecked();

    fireEvent.click(aCheckbox);
    expect(aCheckbox).toBeChecked();
    const aInput = await findByTestId('input-advice-uk');
    expect(aInput).toBeInTheDocument();
    expect(bCheckbox).not.toBeChecked();

    fireEvent.click(bCheckbox);
    expect(bCheckbox).toBeChecked();
    const bInput = await findByTestId('input-citizens-advice');
    expect(bInput).toBeInTheDocument();

    fireEvent.click(oCheckbox);
    expect(oCheckbox).toBeChecked();
    const oInput = await findByTestId('input-other');
    expect(oInput).toBeInTheDocument();

    expect(aCheckbox).not.toBeChecked();
    expect(aInput).not.toBeInTheDocument();
    expect(bCheckbox).not.toBeChecked();
    expect(bInput).not.toBeInTheDocument();

    const submitButton = getByTestId('signupOrg');
    fireEvent.click(submitButton);

    expect(mockSubmit).toHaveBeenCalled();
  });
});
