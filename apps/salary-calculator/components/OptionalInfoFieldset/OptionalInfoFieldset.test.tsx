import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { OptionalInfoFieldset } from './OptionalInfoFieldset';
import useTranslation from '@maps-react/hooks/useTranslation';

// Mock default export
jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    z: jest.fn((key) => key.en),
  })),
}));

const mockUseTranslation = useTranslation as jest.MockedFunction<
  typeof useTranslation
>;

const checkTextExists = (texts: string[]) => {
  texts.forEach((text) => {
    expect(screen.getByText(text)).toBeInTheDocument();
  });
};

describe('OptionalInfoFieldset', () => {
  it('renders the title and optional text', () => {
    render(<OptionalInfoFieldset title={{ en: 'Title EN', cy: 'Title CY' }} />);

    checkTextExists(['Title EN', '(optional)']);
  });

  it('renders paragraph when provided as object', () => {
    render(
      <OptionalInfoFieldset
        title={{ en: 'Title EN', cy: 'Title CY' }}
        paragraph={{ en: 'Paragraph EN', cy: 'Paragraph CY' }}
      />,
    );

    checkTextExists(['Paragraph EN']);
  });

  it('renders paragraph when provided as ReactNode', () => {
    render(
      <OptionalInfoFieldset
        title={{ en: 'Title EN', cy: 'Title CY' }}
        paragraph={<span>Custom Paragraph</span>}
      />,
    );

    checkTextExists(['Custom Paragraph']);
  });

  it('renders list items when provided', () => {
    render(
      <OptionalInfoFieldset
        title={{ en: 'Title EN', cy: 'Title CY' }}
        listItems={[
          { en: 'Item 1', cy: 'Eitem 1' },
          { en: 'Item 2', cy: 'Eitem 2' },
        ]}
      />,
    );

    checkTextExists(['Item 1', 'Item 2']);
  });

  it('renders children when provided', () => {
    render(
      <OptionalInfoFieldset title={{ en: 'Title EN', cy: 'Title CY' }}>
        <div>Child content</div>
      </OptionalInfoFieldset>,
    );

    checkTextExists(['Child content']);
  });

  it('renders with Welsh translations', () => {
    mockUseTranslation.mockImplementation(
      () =>
        ({
          z: (key: { cy: string }) => key.cy,
        } as any),
    );

    render(
      <OptionalInfoFieldset
        title={{ en: 'Title EN', cy: 'Title CY' }}
        paragraph={{ en: 'Paragraph EN', cy: 'Paragraph CY' }}
      />,
    );

    checkTextExists(['Title CY', '(dewisol)', 'Paragraph CY']);
  });
});

describe('OptionalInfoFieldset - description', () => {
  it('renders description as translation group correctly', () => {
    // Ensure useTranslation returns English for this test
    (useTranslation as jest.Mock).mockImplementation(() => ({
      z: (key: { en: string }) => key.en,
    }));

    render(
      <OptionalInfoFieldset
        title={{ en: 'Title EN', cy: 'Title CY' }}
        description={{ en: 'Desc EN', cy: 'Desc CY' }}
      />,
    );

    checkTextExists(['Desc EN']); // English translation is rendered due to mock
  });

  it('renders description as ReactNode correctly', () => {
    render(
      <OptionalInfoFieldset
        title={{ en: 'Title EN', cy: 'Title CY' }}
        description={<span>Custom Desc</span>}
      />,
    );

    checkTextExists(['Custom Desc']);
  });
});
