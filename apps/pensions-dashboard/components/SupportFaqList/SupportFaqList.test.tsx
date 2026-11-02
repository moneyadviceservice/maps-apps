import { render } from '@testing-library/react';

import { SupportFaqList } from './SupportFaqList';
import mockData from './SupportFaqList.mock.json';

import '@testing-library/jest-dom';

describe('SupportFaqList', () => {
  it('renders correctly with English locale', () => {
    const { getByText } = render(
      <SupportFaqList faqs={mockData} locale="en" />,
    );
    expect(getByText('English title 1')).toBeInTheDocument();
    expect(getByText('english-content-1')).toBeInTheDocument();
    expect(getByText('English title 2')).toBeInTheDocument();
    expect(getByText('english-content-2')).toBeInTheDocument();
  });

  it('renders correctly with Welsh locale', () => {
    const { getByText } = render(
      <SupportFaqList faqs={mockData} locale="cy" />,
    );
    expect(getByText('Welsh title 1')).toBeInTheDocument();
    expect(getByText('welsh-content-1')).toBeInTheDocument();
    expect(getByText('Welsh title 2')).toBeInTheDocument();
    expect(getByText('welsh-content-2')).toBeInTheDocument();
  });

  it('passes through className', () => {
    const { container } = render(
      <SupportFaqList faqs={mockData} locale="en" className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders english as default when no locale is provided', () => {
    const { getByText } = render(<SupportFaqList faqs={mockData} />);
    expect(getByText('English title 1')).toBeInTheDocument();
    expect(getByText('english-content-1')).toBeInTheDocument();
    expect(getByText('English title 2')).toBeInTheDocument();
    expect(getByText('english-content-2')).toBeInTheDocument();
  });
});
