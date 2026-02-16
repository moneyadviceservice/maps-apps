import { render } from '@testing-library/react';

import { Organisation } from '../../../../types/Organisations';
import { baseMockData } from '../__tests__mocks/mock-data';
import { OrganisationDetails } from './OrganisationDetails';

import '@testing-library/jest-dom';

jest.mock('../../../Organisations/SelectOrgType', () => ({
  SelectOrgType: () => <div data-testid="select-org-type" />,
}));

const mockData: Organisation = {
  ...baseMockData,
  id: 'org1',
  type: { type_other: 'charity', title: 'Charity' },
  name: 'Open Minds Org',
  website: 'https://example.com',
  address: '42 Peace Avenue, London, W1A 1AA',
};

describe('OrganisationDetails', () => {
  describe('OrganisationDetails component in read mode', () => {
    it('renders organisation name, type, website, and address', () => {
      const { container, getByTestId } = render(
        <OrganisationDetails data={mockData} />,
      );

      expect(getByTestId('org-name')).toHaveTextContent('Open Minds Org');
      expect(getByTestId('org-type')).toHaveTextContent('Charity');
      expect(getByTestId('org-website')).toHaveTextContent(
        'https://example.com',
      );
      expect(getByTestId('org-address')).toHaveTextContent(
        '42 Peace Avenue, London, W1A 1AA',
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe('OrganisationDetails component in edit mode', () => {
    it('renders with default values', () => {
      const { container, getByDisplayValue, getByTestId } = render(
        <OrganisationDetails data={mockData} isEditMode={true} />,
      );

      const orgName = getByDisplayValue('Open Minds Org');
      expect(orgName).toBeInTheDocument();
      expect(orgName).toHaveAttribute('name', 'name');
      expect(getByTestId('select-org-type')).toBeInTheDocument();

      const domainInput = getByDisplayValue('https://example.com');
      expect(domainInput).toBeInTheDocument();
      expect(domainInput).toHaveAttribute('name', 'website');

      const addressLabel = getByTestId('street-address');
      expect(addressLabel).toBeInTheDocument();

      const addressInput = getByTestId('street-address-input');
      expect(addressInput).toHaveAttribute('name', 'address');
      expect(addressInput).toHaveValue('42 Peace Avenue, London, W1A 1AA');

      expect(container).toMatchSnapshot();
    });

    it('does not render non-editable organisation address column', () => {
      const { queryByTestId } = render(
        <OrganisationDetails data={mockData} isEditMode={true} />,
      );

      const addressCol = queryByTestId('org-address');
      expect(addressCol).not.toBeInTheDocument();
    });
  });
});
