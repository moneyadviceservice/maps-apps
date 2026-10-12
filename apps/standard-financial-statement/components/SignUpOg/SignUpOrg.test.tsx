import { FormFlowType } from 'data/form-data/org_signup';
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

const requiredFields = [
  { name: 'organisationName', numberOfInputs: 1 },
  { name: 'organisationStreet', numberOfInputs: 1 },
  { name: 'organisationCity', numberOfInputs: 1 },
  { name: 'organisationPostcode', numberOfInputs: 1 },
  { name: 'organisationType', numberOfInputs: 1 },
  { name: 'geoRegions', numberOfInputs: 11 },
  { name: 'organisationUse', numberOfInputs: 1 },
  { name: 'debtAdvice', numberOfInputs: 3 },
  { name: 'sfslive', numberOfInputs: 2, isRadio: true },
  { name: 'sfsLaunchDate', numberOfInputs: 1 },
  { name: 'fcaReg', numberOfInputs: 2, isRadio: true },
  { name: 'memberships', numberOfInputs: 18 },
];

const optionalFields = [
  { name: 'organisationWebsite', numberOfInputs: 1 },
  { name: 'caseManagementSoftware', numberOfInputs: 1 },
];

const errorFields = [
  'organisationName',
  'organisationStreet',
  'organisationCity',
  'organisationPostcode',
  'organisationType',
  'geoRegions',
  'organisationUse',
  'debtAdvice',
  'sfslive',
  'sfsLaunchDate',
  'fcaReg',
  'memberships',
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
    flow: FormFlowType.NEW_ORG,
    step: 'user',
    organisationName: '',
    organisationStreet: '',
    organisationCity: '',
    organisationPostcode: '',
    organisationType: '',
    geoRegions: [],
    organisationUse: '',
    debtAdvice: [],
    sfslive: '',
    sfsLaunchDate: '',
    caseManagementSoftware: '',
    fcaReg: '',
    fcaRegNumber: '',
    memberships: [],
  },
  errors: [],
};

const testIdPrefix = 'idPrefix-';

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
        inputIdPrefix={testIdPrefix}
      />,
    );
    expect(container).toMatchSnapshot();
    [...requiredFields, ...optionalFields].forEach((field) => {
      const inputs = container.querySelectorAll(`[name="${field.name}"]`);
      expect(inputs).toHaveLength(field.numberOfInputs);

      inputs.forEach((input) => {
        expect(input).not.toHaveAttribute('aria-invalid', 'true');
      });
    });
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
        inputIdPrefix={testIdPrefix}
      />,
    );
    expect(container).toMatchSnapshot();
    [...requiredFields].forEach((field) => {
      const inputs = container.querySelectorAll(`[name="${field.name}"]`);
      expect(inputs).toHaveLength(field.numberOfInputs);

      inputs.forEach((input) => {
        // aria-invalid is not supported on radio inputs
        if (field.isRadio) {
          expect(input).not.toHaveAttribute('aria-invalid');
        } else {
          expect(input).toHaveAttribute('aria-invalid', 'true');
        }

        expect(input).toHaveAttribute(
          'aria-describedby',
          `${testIdPrefix}${field.name}-error`,
        );
      });

      if (field.numberOfInputs > 1) {
        const fieldset = container.querySelector(
          `fieldset#${testIdPrefix}${field.name}`,
        );

        // aria-invalid is not supported on radio inputs (it should be placed on the wrapping element with a `radiogroup` role instead, usually a fieldset)
        if (field.isRadio) {
          expect(fieldset).toHaveAttribute('role', 'radiogroup');
          expect(fieldset).toHaveAttribute('aria-invalid', 'true');
        } else {
          expect(fieldset).not.toHaveAttribute('aria-invalid');
        }

        expect(fieldset).toHaveAttribute(
          'aria-describedby',
          `${testIdPrefix}${field.name}-error`,
        );
      }

      expect(
        container.querySelectorAll(`#${testIdPrefix}${field.name}-error`),
      ).toHaveLength(1);
    });
  });

  it('renders correctly conditional inputs', () => {
    const { container } = render(
      <SignUpOrg
        onSubmit={jest.fn()}
        entry={{
          data: {
            ...mockEntry.data,
            organisationType: 'other',
            organisationUse: 'other',
            fcaReg: 'fca-yes',
            memberships: ['advice-ni'],
          },
          errors: [],
        }}
        lang="en"
        inputIdPrefix={testIdPrefix}
      />,
    );
    expect(container).toMatchSnapshot();
    [
      'organisationTypeOther',
      'organisationUseOther',
      'fcaRegNumber',
      'advice-ni',
    ].forEach((field) => {
      expect(
        container.querySelectorAll(`#${testIdPrefix}${field}`),
      ).toHaveLength(1);
    });
  });

  it('renders correctly conditional inputs errors', () => {
    const conditionalErrorFields = [
      'organisationUseOther',
      'organisationTypeOther',
      'fcaRegNumber',
      'advice-ni',
    ];
    const { container } = render(
      <SignUpOrg
        onSubmit={jest.fn()}
        entry={{
          data: {
            ...mockEntry.data,
            organisationName: 'Test Organisation',
            organisationWebsite: 'https://example.com',
            organisationStreet: '123 Test St',
            organisationCity: 'Test City',
            organisationPostcode: '12345',
            organisationType: 'other',
            organisationTypeOther: '',
            geoRegions: ['north-east'],
            organisationUse: 'other',
            organisationUseOther: '',
            debtAdvice: ['online'],
            sfslive: 'true',
            sfsLaunchDate: '2023-01-01',
            caseManagementSoftware: 'Test',
            fcaReg: 'fca-yes',
            fcaRegNumber: '',
            memberships: ['advice-ni'],
            'advice-ni': '',
          },
          errors: conditionalErrorFields.map((key) => ({
            field: key,
            type: 'too_small',
          })),
        }}
        lang="en"
        inputIdPrefix={testIdPrefix}
      />,
    );
    expect(container).toMatchSnapshot();
    conditionalErrorFields.forEach((field) => {
      const inputs = container.querySelectorAll(`[name="${field}"]`);
      expect(inputs).toHaveLength(1);
      expect(inputs[0]).toHaveAttribute('aria-invalid', 'true');
      expect(inputs[0]).toHaveAttribute(
        'aria-describedby',
        `${testIdPrefix}${field}-error`,
      );
      expect(
        container.querySelectorAll(`#${testIdPrefix}${field}-error`),
      ).toHaveLength(1);
    });
  });

  it('renders memberships checkboxes and has correct functionality', async () => {
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
            organisationType: '',
            geoRegions: [],
            organisationUse: '',
            debtAdvice: [],
            sfslive: '',
            sfsLaunchDate: '',
            fcaReg: 'fca-yes',
            memberships: mockMembership as unknown as string[],
          },
          errors: errorFields,
        }}
        lang="en"
        inputIdPrefix={testIdPrefix}
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
