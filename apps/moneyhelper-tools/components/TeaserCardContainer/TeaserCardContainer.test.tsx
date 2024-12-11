import React from 'react';

import { render } from '@testing-library/react';

import { TeaserCardContainer } from './TeaserCardContainer';

import '@testing-library/jest-dom';

jest.mock('@maps-react/common/components/TeaserCard', () => {
  return jest.fn(({ title }) => (
    <div data-testid="teaserCardMock">{title}</div>
  ));
});

describe('TeaserCardContainer', () => {
  it('renders TeaserCardContainer component correctly', () => {
    render(
      <TeaserCardContainer>
        <div>Child</div>
      </TeaserCardContainer>,
    );

    expect(document.body).toHaveTextContent('Child');
  });
});
