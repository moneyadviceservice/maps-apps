import { render, screen } from '@testing-library/react';

import { mockUseTranslation } from '@maps-react/mhf/mocks';

import { Loading } from '.';
import cy from '../../../public/locales/taking-part/cy.json';
import en from '../../../public/locales/taking-part/en.json';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

describe('Loading', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      locale: 'en',
    });
  });

  it('shows the waiting message and refreshes to the submit route', () => {
    render(<Loading submitPath="/en/taking-part/submit-data" />);

    expect(screen.getByTestId('nonjs-spinner')).toBeInTheDocument();
    expect(screen.getByTestId('loading-content')).toHaveTextContent(
      'taking-part/components.loading.title',
    );
    const refresh = document.querySelector('meta[http-equiv="refresh"]');
    expect(refresh).toHaveAttribute(
      'content',
      '2;url=/en/taking-part/submit-data',
    );
  });

  it('uses the shared form loading copy', () => {
    expect(en.components.loading.title).toBe(
      'Your request is being submitted - please stay on this page. \n\nThis may take a few seconds.',
    );
    expect(cy.components.loading.title).toBe(
      'Mae eich cais wedi’i anfon - arhoswch ar y dudalen hon. \n\nGall hyn gymryd ychydig eiliadau.',
    );
  });
});
