import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('copy-to-clipboard', () => jest.fn());
const mockCopyToClipboard = jest.requireMock('copy-to-clipboard');

import { Tool } from './Tool';

describe('Select component', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    mockCopyToClipboard.mockClear();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('renders correctly', () => {
    const { container } = render(
      <Tool path="Test" title="test" description="test" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly', () => {
    const { container } = render(
      <Tool path="Test" title="test" description="test" />,
    );
    fireEvent.click(screen.getByTestId('copy-embed'));
    fireEvent.change(screen.getByTestId('language-select'));
    expect(container).toMatchSnapshot();
  });

  it('renders external tool correctly', () => {
    const { container } = render(
      <Tool
        path="Test"
        title="test"
        description="test"
        details={{
          en: {
            embedCode: 'test',
            url: 'test',
          },
          cy: {
            embedCode: 'test',
            url: 'test',
          },
        }}
      />,
    );
    fireEvent.click(screen.getByTestId('copy-embed'));
    fireEvent.change(screen.getByTestId('language-select'));
    expect(container).toMatchSnapshot();
  });

  it('uses production origin when in production environment', () => {
    process.env.NEXT_PUBLIC_ENVIRONMENT = 'production';
    const { container } = render(
      <Tool
        path="Test"
        title="test"
        description="test"
        productionOrigin="https://prod.example.com"
        stagingOrigin="https://staging.example.com"
      />,
    );
    expect(container).toMatchSnapshot();
    expect(screen.getByText('English home page')).toHaveAttribute(
      'href',
      'https://prod.example.com/en/Test',
    );
  });

  it('uses staging origin when not in production environment', () => {
    process.env.NEXT_PUBLIC_ENVIRONMENT = 'staging';
    const { container } = render(
      <Tool
        path="Test"
        title="test"
        description="test"
        productionOrigin="https://prod.example.com"
        stagingOrigin="https://staging.example.com"
      />,
    );
    expect(container).toMatchSnapshot();
    expect(screen.getByText('English home page')).toHaveAttribute(
      'href',
      'https://staging.example.com/en/Test',
    );
  });

  it('uses empty string when both origins are undefined', () => {
    jest.mock('@maps-react/utils/generateEmbedCode', () => ({
      generateEmbedCode: jest.fn(() => undefined),
    }));

    process.env.NEXT_PUBLIC_ENVIRONMENT = 'production';
    render(<Tool path="Test" title="test" description="test" />);

    expect(screen.getByLabelText('1. Choose a language')).toBeInTheDocument();
    expect(screen.getByText('English home page')).toHaveAttribute(
      'href',
      '/en/Test',
    );
  });

  it('shows "Done!" message after copying to clipboard', () => {
    render(<Tool path="Test" title="test" description="test" />);

    // Verify "Done!" message is not present initially
    expect(screen.queryByText('Done!')).not.toBeInTheDocument();

    // Click the copy button
    fireEvent.click(screen.getByTestId('copy-embed'));

    // Verify "Done!" message appears
    expect(screen.getByText('Done!')).toBeInTheDocument();
  });

  it('calls copy with correct arguments and debug option', () => {
    const testCode = '<script>test</script>';
    render(
      <Tool
        path="Test"
        title="test"
        description="test"
        details={{
          en: {
            embedCode: testCode,
            url: 'test',
          },
          cy: {
            embedCode: 'welsh-test',
            url: 'test',
          },
        }}
      />,
    );

    fireEvent.click(screen.getByTestId('copy-embed'));

    expect(mockCopyToClipboard).toHaveBeenCalledWith(testCode, { debug: true });
  });

  it('calls copy with generated embed code', () => {
    render(<Tool path="Test" title="test" description="test" />);

    fireEvent.click(screen.getByTestId('copy-embed'));

    expect(mockCopyToClipboard).toHaveBeenCalledWith(
      expect.stringContaining('<script src="/api/embed"></script>'),
      { debug: true },
    );
  });
});

describe('Tool component URL handling', () => {
  it('handles missing details and URLs correctly', () => {
    // Test undefined details
    render(
      <Tool
        path="test-tool"
        title="Test Tool"
        description="Test description"
      />,
    );

    // Test with details but missing URL
    render(
      <Tool
        path="test-tool"
        title="Test Tool"
        description="Test description"
        details={{
          en: { embedCode: '<div>test</div>' },
          cy: { embedCode: '<div>test</div>' },
        }}
      />,
    );

    // Test with complete details and URL
    render(
      <Tool
        path="test-tool"
        title="Test Tool"
        description="Test description"
        details={{
          en: { embedCode: '<div>test</div>', url: 'https://example.com/en' },
          cy: { embedCode: '<div>test</div>', url: 'https://example.com/cy' },
        }}
      />,
    );

    const links = screen.getAllByRole('link', { name: /home page/i });
    expect(links).toHaveLength(4);

    expect(links[2]).toHaveAttribute('href', 'https://example.com/en');
    expect(links[3]).toHaveAttribute('href', 'https://example.com/cy');
  });
});
