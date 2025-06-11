import React from 'react';

import { render } from '@testing-library/react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { ToolFeedback } from './ToolFeedback';

jest.mock('@maps-react/hooks/useTranslation');

describe('ToolFeedback component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default survey IDs (en)', () => {
    (useTranslation as jest.Mock).mockReturnValue({
      locale: 'en',
    });

    const { container } = render(<ToolFeedback />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with default survey IDs (cy)', () => {
    (useTranslation as jest.Mock).mockReturnValue({
      locale: 'cy',
    });

    const { container } = render(<ToolFeedback />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with custom survey IDs', () => {
    (useTranslation as jest.Mock).mockReturnValue({
      locale: 'en',
    });

    const customSurveyIds = {
      production: {
        en: 'custom-en-prod-id',
        cy: 'custom-cy-prod-id',
      },
      development: {
        en: 'custom-en-dev-id',
        cy: 'custom-cy-dev-id',
      },
    };

    const { container } = render(<ToolFeedback surveyIds={customSurveyIds} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('applies custom className correctly', () => {
    (useTranslation as jest.Mock).mockReturnValue({
      locale: 'en',
    });

    const { container } = render(<ToolFeedback className="test-class" />);
    expect(
      (container.firstChild as HTMLElement).classList.contains('test-class'),
    ).toBe(true);
  });
});
