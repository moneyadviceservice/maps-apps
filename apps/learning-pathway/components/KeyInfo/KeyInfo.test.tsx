import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { mapJsonRichText } from '@maps-react/vendor/utils/RenderRichText/RenderRichText';

import KeyInfo from './KeyInfo';

jest.mock('@maps-react/vendor/utils/RenderRichText/RenderRichText', () => {
  const actual = jest.requireActual(
    '@maps-react/vendor/utils/RenderRichText/RenderRichText',
  );

  return {
    ...actual,
    mapJsonRichText: jest.fn(),
  };
});

const mockMapJsonRichText = mapJsonRichText as jest.Mock;

describe('KeyInfo', () => {
  const baseProps = {
    title: 'Key information',
    tags: [
      {
        group: 'Type of learning',
        slug: 'type-of-learning',
        key: 'type-of-learning',
        order: 1,
        tags: [
          { value: 'training', label: 'Training' },
          { value: 'qualification', label: 'Qualification' },
        ],
      },
      {
        group: 'Country',
        slug: 'country',
        key: 'country',
        order: 2,
        tags: [{ value: 'england', label: 'England' }],
      },
    ],
    ownerTitle: 'Owner',
    owner: 'MoneyHelper',
    accreditedDateTitle: 'Date Accredited',
    dateAccredited: '2024-01-15T00:00:00.000Z',
    launchedDateTitle: 'Date Launched',
    dateLaunched: '2024-02-20T00:00:00.000Z',
    preRequisiteTitle: 'Pre-requisite',
    preRequisite: 'None',
    furtherInfoTitle: 'Further information',
    furtherInfo: [{ nodeType: 'paragraph', content: [] }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockMapJsonRichText.mockReturnValue([
      <p key="mock-further-info">Mock further info content</p>,
    ]);
  });

  it('renders all key information sections with provided content', () => {
    render(<KeyInfo {...baseProps} />);

    expect(
      screen.getByRole('heading', { name: 'Key information', level: 4 }),
    ).toBeInTheDocument();
    expect(screen.getByText('Type of learning')).toBeInTheDocument();
    expect(screen.getByText('Training')).toBeInTheDocument();
    expect(screen.getByText('Qualification')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByText('England')).toBeInTheDocument();
    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getByText('MoneyHelper')).toBeInTheDocument();
    expect(screen.getByText('Pre-requisite')).toBeInTheDocument();
    expect(screen.getByText('None')).toBeInTheDocument();
    expect(screen.getByText('Further information')).toBeInTheDocument();
    expect(screen.getByText('Mock further info content')).toBeInTheDocument();
  });

  it('passes furtherInfo to mapJsonRichText', () => {
    render(<KeyInfo {...baseProps} />);

    expect(mockMapJsonRichText).toHaveBeenCalledWith(baseProps.furtherInfo);
    expect(mockMapJsonRichText).toHaveBeenCalledTimes(1);
  });
});
