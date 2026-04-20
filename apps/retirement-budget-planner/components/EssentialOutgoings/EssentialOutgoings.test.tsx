import {
  mockFielsNames,
  mockPageContent,
  mockPageData,
} from 'lib/mocks/mockEssentialOutgoings';
import { EssentialOutgoings } from './EssentialOutgoings';
import { fireEvent, render, screen } from '@testing-library/react';
import { SummaryContextProvider } from 'context/SummaryContextProvider';
import { saveDataToMemoryOnFocusOut } from 'lib/util/contentFilter';
import { sumFields } from 'lib/util/summaryCalculations/calculations';
import { PageContentType, CostsFieldTypes } from 'lib/types/page.type';
import { costDefaultFrequencies } from 'data/essentialOutgoingsData';

jest.mock('lib/util/contentFilter/contentFilter', () => ({
  saveDataToMemoryOnFocusOut: jest.fn(),
  generateMultipleItems: jest.fn(),
}));

jest.mock('data/essentialOutgoingsData', () => ({
  costDefaultFrequencies: jest.fn(),
}));

jest.mock('lib/util/summaryCalculations/calculations', () => ({
  sumFields: jest.fn().mockReturnValue(0),
}));

const mockScrollIntoView = jest.fn();
Element.prototype.scrollIntoView = mockScrollIntoView;

const mockMatchMedia = (matches: boolean) =>
  Object.defineProperty(globalThis, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
    })),
  });

const renderWithContext = (
  props?: Partial<React.ComponentProps<typeof EssentialOutgoings>>,
) => {
  return render(
    <SummaryContextProvider>
      <EssentialOutgoings
        pageData={mockPageData()}
        fieldNames={mockFielsNames()}
        pageContent={mockPageContent()}
        tabName={'essential-outgoings'}
        sessionId={'ASGDHB'}
        summaryData={undefined}
        {...props}
      />
    </SummaryContextProvider>,
  );
};

describe('Essential outgoings component', () => {
  beforeEach(() => {
    (costDefaultFrequencies as jest.Mock).mockReturnValue(mockFielsNames());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render component', () => {
    const { container } = renderWithContext();
    expect(container).toMatchSnapshot();
  });

  it('should handle field change successfully', () => {
    renderWithContext();

    const label = screen.getAllByTestId('additionalInput1Label');
    const moneyInput = screen.getAllByTestId('additionalInput1Id');
    const frequency = screen.getAllByTestId('additionalInput1Frequency');

    expect(label.length).toBe(1);
    fireEvent.change(label[0], { target: { value: 'car' } });
    expect((label[0] as HTMLInputElement).value).toBe('car');

    expect(label.length).toBe(1);
    fireEvent.change(label[0], { target: { value: '' } });
    expect((label[0] as HTMLInputElement).value).toBe('');

    expect(moneyInput.length).toBe(1);
    fireEvent.change(moneyInput[0], { target: { value: '4000' } });
    expect((moneyInput[0] as HTMLInputElement).value).toBe('4,000');

    expect(frequency.length).toBe(1);
    fireEvent.change(frequency[0], { target: { value: 'week' } });
    expect((frequency[0] as HTMLInputElement).value).toBe('week');
  });

  it('should save data to redis on focus out', () => {
    const mockSaveDataToMemory = jest.fn();
    (saveDataToMemoryOnFocusOut as jest.Mock).mockImplementation(
      mockSaveDataToMemory,
    );
    renderWithContext();
    fireEvent.focusOut(screen.getByTestId('mortgageId'));

    expect(mockSaveDataToMemory).toHaveBeenCalledTimes(1);
  });

  it('should update spending summary data', () => {
    const mockSumfields = jest.fn();
    (sumFields as jest.Mock).mockImplementation(mockSumfields);

    renderWithContext({
      summaryData: {
        income: 200,
        spending: 0,
      },
    });

    const moneyInput = screen.getAllByTestId('mortgageId');
    expect(moneyInput.length).toBe(1);
    fireEvent.change(moneyInput[0], { target: { value: '100' } });
    expect(mockSumfields).toHaveBeenCalledTimes(1);
  });

  it('should scroll to anchored element and open parent details element', () => {
    mockMatchMedia(false); // prefers-reduced-motion is not enabled

    globalThis.location.hash = '#housing';

    renderWithContext();

    const anchoredElement = document.getElementById('housing');
    expect(anchoredElement).toBeInTheDocument();

    const parentDetailsElement = anchoredElement?.closest('details');
    expect(parentDetailsElement).toBeInTheDocument();
    expect(parentDetailsElement).toHaveAttribute('open');

    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('should scroll to anchored element without animation if user prefers reduced motion', () => {
    mockMatchMedia(true); // prefers-reduced-motion is enabled

    globalThis.location.hash = '#housing';

    renderWithContext();

    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'instant',
      block: 'start',
    });
  });

  it('should not scroll if there is no hash in the URL', () => {
    globalThis.location.hash = '';

    renderWithContext();

    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });

  it('should render multiple sections with different description states', () => {
    const mockPageContentMixed = {
      ...mockPageContent(),
      content: [
        {
          sectionName: 'section1',
          sectionTitle: 'Section 1',
          sectionDescription: 'Description for section 1',
        },
        {
          sectionName: 'section2',
          sectionTitle: 'Section 2',
          sectionDescription: '',
        },
        {
          sectionName: 'section3',
          sectionTitle: 'Section 3',
          sectionDescription: 'Description for section 3',
        },
      ],
    } satisfies PageContentType;

    const mockFieldNamesMixed = [
      {
        sectionName: 'section1',
        items: [],
      },
      {
        sectionName: 'section2',
        items: [],
      },
      {
        sectionName: 'section3',
        items: [],
      },
    ] satisfies CostsFieldTypes[];

    renderWithContext({
      pageContent: mockPageContentMixed,
      fieldNames: mockFieldNamesMixed,
    });

    // Should render descriptions for section 1 and 3 but not section 2
    expect(screen.getByText('Description for section 1')).toBeInTheDocument();
    expect(
      screen.queryByText('Description for section 2'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Description for section 3')).toBeInTheDocument();
  });
});

describe('EssentialOutgoings component edge cases', () => {
  const originalMatchMedia = globalThis.matchMedia;

  afterEach(() => {
    jest.clearAllMocks();
    globalThis.matchMedia = originalMatchMedia;
  });

  it('should apply correct fallback if matchMedia does not exist', () => {
    // @ts-expect-error – testing non-browser environment
    globalThis.matchMedia = undefined;

    globalThis.location.hash = '#housing';

    renderWithContext();

    // Should be equivalent to user having prefers-reduced-motion enabled
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'instant',
      block: 'start',
    });
  });

  it('should not scroll if anchored element does not exist', () => {
    globalThis.location.hash = '#nonExistentElement';

    renderWithContext();

    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });

  it('should not scroll if parent details element does not exist', () => {
    // Create element without details parent to mock invalid <ExpandableSection>
    const mockAnchoredElement = document.createElement('div');
    mockAnchoredElement.id = 'mockAnchoredElement';
    document.body.appendChild(mockAnchoredElement);

    globalThis.location.hash = '#mockAnchoredElement';

    renderWithContext();

    expect(mockScrollIntoView).not.toHaveBeenCalled();

    // Remove mocked standalone element
    mockAnchoredElement.remove();
  });

  it('should not focus if summary element does not exist', () => {
    const focusMock = jest.spyOn(HTMLElement.prototype, 'focus');

    // Create details element without summary to mock invalid <ExpandableSection>
    const mockDetailsElement = document.createElement('details');
    const mockAnchoredElement = document.createElement('div');
    mockAnchoredElement.id = 'mockAnchoredElement';
    mockDetailsElement.appendChild(mockAnchoredElement);
    document.body.appendChild(mockDetailsElement);

    globalThis.location.hash = '#mockAnchoredElement';

    renderWithContext();

    expect(focusMock).not.toHaveBeenCalled();

    // Remove mocked details element
    mockDetailsElement.remove();
  });
  it('should render VisibleSection with Markdown when section has description', () => {
    const mockPageContentWithDescription = {
      ...mockPageContent(),
      content: [
        {
          ...mockPageContent().content[0],
          sectionDescription: 'This is a test description with **bold** text',
        },
      ],
    };

    renderWithContext({ pageContent: mockPageContentWithDescription });

    // Check that VisibleSection is rendered
    const markdownContent = screen.getByText(/This is a test description/);
    expect(markdownContent).toBeInTheDocument();

    // Verify Markdown component has correct className
    expect(markdownContent.closest('.font-normal')).toBeInTheDocument();
  });
});
