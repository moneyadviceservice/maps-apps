import React from 'react';
import { render, screen } from '@testing-library/react';
import { PensionOption } from '.';
import mockData from './PensionOption.mock.json';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

const queryData = {
  query: {
    language: 'en',
  },
};

const mockSuitableCallout = {
  suitableCallout: {
    json: [
      {
        nodeType: 'paragraph',
        content: [
          {
            nodeType: 'text',
            value: 'Suitable callout',
            format: {
              variants: ['bold'],
            },
          },
        ],
      },
    ],
  },
};

const mockUnsuitableCallout = {
  unsuitableCallout: {
    json: [
      {
        nodeType: 'paragraph',
        content: [
          {
            nodeType: 'text',
            value: 'Unsuitable callout',
            format: {
              variants: ['bold'],
            },
          },
        ],
      },
    ],
  },
};

const defaultMock = {
  data: {
    ...mockData,
  },
  ...queryData,
};

const mockWithToolIntro = {
  data: {
    ...mockData,
    toolIntro: {
      json: [
        {
          nodeType: 'paragraph',
          content: [
            {
              nodeType: 'text',
              value: 'Tool intro text',
            },
          ],
        },
      ],
    },
  },
  ...queryData,
};

const mockWithSuitableCallout = {
  data: {
    ...mockData,
    ...mockSuitableCallout,
  },
  ...queryData,
};

const mockWithUnSuitableCallout = {
  data: {
    ...mockData,
    ...mockUnsuitableCallout,
  },
  ...queryData,
};

const mockWithBothCallouts = {
  data: {
    ...mockData,
    ...mockUnsuitableCallout,
    ...mockSuitableCallout,
  },
  ...queryData,
};

const mockWithWarningCallout = {
  data: {
    ...mockData,
    warningCallout: {
      json: [
        {
          nodeType: 'paragraph',
          content: [
            {
              nodeType: 'text',
              value: 'This is a warning',
            },
          ],
        },
      ],
    },
  },
  ...queryData,
};

const mockWithExpandableSection = {
  data: {
    ...mockData,
    expandableSectionsTitle: 'More information',
    expandableSection: [
      {
        title: 'Expandable title',
        content: {
          json: [
            {
              nodeType: 'paragraph',
              content: [
                {
                  nodeType: 'text',
                  value: 'Some text',
                },
              ],
            },
          ],
        },
      },
    ],
  },
  ...queryData,
};

describe('PensionOption component', () => {
  it('renders correctly with default values', () => {
    render(<PensionOption {...defaultMock} />);
    const container = screen.getByTestId('pension-option');
    expect(container).toMatchSnapshot();
  });

  it('renders with an optional tool intro', () => {
    render(<PensionOption {...mockWithToolIntro} />);
    const container = screen.getByTestId('pension-option');
    expect(container).toMatchSnapshot();
  });

  it('renders with an optional suitable callout', () => {
    render(<PensionOption {...mockWithSuitableCallout} />);
    const container = screen.getByTestId('pension-option');
    expect(container).toMatchSnapshot();
  });

  it('renders with an optional unsuitable callout', () => {
    render(<PensionOption {...mockWithUnSuitableCallout} />);
    const container = screen.getByTestId('pension-option');
    expect(container).toMatchSnapshot();
  });

  it('renders with optional suitable and unsuitable callouts', () => {
    render(<PensionOption {...mockWithBothCallouts} />);
    const container = screen.getByTestId('pension-option');
    expect(container).toMatchSnapshot();
  });

  it('renders with an optional warning callout', () => {
    render(<PensionOption {...mockWithWarningCallout} />);
    const container = screen.getByTestId('pension-option');
    expect(container).toMatchSnapshot();
  });

  it('renders with an optional expandable section', () => {
    render(<PensionOption {...mockWithExpandableSection} />);
    const container = screen.getByTestId('pension-option');
    expect(container).toMatchSnapshot();
  });
});
