import { render } from '@testing-library/react';

import { DetailRow } from './PensionDetailRow';

import '@testing-library/jest-dom/extend-expect';

describe('DetailRow Component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <DetailRow heading="Test Heading">
        <td>Test Content</td>
      </DetailRow>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders the heading correctly', () => {
    const { getByText } = render(
      <DetailRow heading="Test Heading">
        <td>Test Content</td>
      </DetailRow>,
    );
    expect(getByText('Test Heading')).toBeInTheDocument();
  });

  it('applies default heading classes', () => {
    const { getByText } = render(
      <DetailRow heading="Test Heading">
        <td>Test Content</td>
      </DetailRow>,
    );
    expect(getByText('Test Heading')).toHaveClass(
      'text-left align-top font-bold pt-[10px] pb-[2px] md:pt-[14px] md:pb-4 max-md:block md:w-1/2 lg:w-2/5',
    );
  });

  it('merges custom heading classes', () => {
    const { getByText } = render(
      <DetailRow heading="Test Heading" headingClasses="custom-class">
        <td>Test Content</td>
      </DetailRow>,
    );
    expect(getByText('Test Heading')).toHaveClass('custom-class');
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <DetailRow heading="Test Heading">
        <td>Test Content</td>
      </DetailRow>,
    );
    expect(getByText('Test Content')).toBeInTheDocument();
  });
});
