import React from 'react';

import { render } from '@testing-library/react';

import { Details } from './Details';

describe('Render Details component', () => {
  it('should render Details component', () => {
    render(
      <Details title="Details title" testID="details">
        {' '}
        <div>
          The customer’s unique reference number can be found on the summary
          page or save and come back later email after completing an
          appointment. A unique reference number won&apos;t be provided for
          partially completed appointments
        </div>
      </Details>,
    );

    const details = document.querySelector('[data-testid="details"]');
    expect(details).toMatchSnapshot();
  });
});
