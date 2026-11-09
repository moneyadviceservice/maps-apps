import { render, screen } from '@testing-library/react';

import { mockSteps, mockUseTranslation } from '@maps-react/mhf/mocks';

import { DataAndPrivacy } from '.';
import cy from '../../../public/locales/taking-part/cy.json';
import en from '../../../public/locales/taking-part/en.json';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

const privacyNoticeUrl =
  'https://portal.participantkit.com/f7446ec8-3a6a-4763-a416-fbac77ffdee7';

const listItems = ['mock-item', 'mock-item'];

describe('DataAndPrivacy Component', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => listItems,
      locale: 'en',
    });
  });

  it('renders the approved sections and continue action', () => {
    const { container } = render(<DataAndPrivacy step={mockSteps[0]} />);

    expect(screen.getByTestId('step-0-section')).toBeInTheDocument();
    expect(screen.getByTestId('step-0-research-heading').tagName).toBe('H2');
    expect(screen.getByTestId('step-0-removing-heading').tagName).toBe('H2');
    expect(screen.getByTestId('step-0-identifiers')).toBeInTheDocument();
    expect(screen.getByTestId('step-0-research-list')).toBeInTheDocument();
    expect(screen.getByTestId('step-0-removing-list')).toBeInTheDocument();
    expect(screen.getByTestId('form-button')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});

describe('data and privacy copy', () => {
  const enCopy = en.components['data-and-privacy'];
  const cyCopy = cy.components['data-and-privacy'];

  it('matches the approved English stakeholder copy', () => {
    expect(enCopy.title).toBe('Your data and privacy');
    expect(enCopy.intro).toContain('**we do not store it**');
    expect(enCopy.intro).toContain('pseudonymised codes');
    expect(enCopy['these-are']).toBe('**These are:**');
    expect(enCopy.identifiers).toEqual([
      'identifiers for your consents',
      'a unique code representing you',
      'identifiers for any pensions matched to you.',
    ]);
    expect(enCopy['research-heading']).toBe('How we use your research data');
    expect(enCopy['research-paragraphs']).toHaveLength(3);
    expect(enCopy['research-list'][0]).toContain('**2 years**');
    expect(enCopy['research-list'][1]).toContain('**GDPR**');
    expect(enCopy['privacy-notice']).toBe(
      `See our [privacy notice](${privacyNoticeUrl}) for more information.`,
    );
    expect(enCopy['removing-heading']).toBe('Removing your research data');
    expect(enCopy['removing-intro']).toContain('mailto:dpo@maps.org.uk');
    expect(enCopy['removing-list'][1]).toContain('**5 years of inactivity**');
  });

  it('matches the official Welsh translation', () => {
    expect(cyCopy.title).toBe("Eich data a'ch preifatrwydd");
    expect(cyCopy.intro).toContain('**nid ydym yn ei storio**');
    expect(cyCopy['these-are']).toBe('**Y rhain yw:**');
    expect(cyCopy.identifiers).toEqual([
      'dynodwyr ar gyfer eich caniatâd',
      "cod unigryw sy'n eich cynrychioli chi",
      "dynodwyr ar gyfer unrhyw bensiynau sy'n cael eu cyfateb i chi.",
    ]);
    expect(cyCopy['research-heading']).toBe(
      'Sut rydym yn defnyddio eich data ymchwil',
    );
    expect(cyCopy['research-paragraphs']).toHaveLength(3);
    expect(cyCopy['research-list'][0]).toContain('**2 flynedd**');
    expect(cyCopy['research-list'][1]).toContain('**GDPR**');
    expect(cyCopy['privacy-notice']).toBe(
      `Gweler ein [hysbysiad preifatrwydd](${privacyNoticeUrl}) (mewn Saesneg) am ragor o wybodaeth.`,
    );
    expect(cyCopy['removing-heading']).toBe('Tynnu eich data ymchwil');
    expect(cyCopy['removing-intro']).toContain('mailto:dpo@maps.org.uk');
    expect(cyCopy['removing-list'][1]).toContain(
      '**5 blynedd o anweithgarwch**',
    );
  });
});
