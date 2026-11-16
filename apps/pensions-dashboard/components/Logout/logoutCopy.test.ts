import cy from '../../public/locales/cy.json';
import en from '../../public/locales/en.json';

describe('logout copy', () => {
  it('uses the English exit copy', () => {
    expect(en.site.logout).toEqual({
      'about-to-leave': 'You’re about to leave',
      'we-will-redirect':
        'We’ll redirect you to MoneyHelper. Your data will not be saved. If you exit the service now, you’ll need to sign back in using GOV.UK One Login to view your pensions.',
      'are-you-sure': 'Are you sure you want to leave?',
      'yes-exit': 'Yes, exit the Dashboard',
    });
  });

  it('uses the Welsh exit copy', () => {
    expect(cy.site.logout).toEqual({
      'about-to-leave': 'Rydych ar fin gadael',
      'we-will-redirect':
        'Byddwn yn eich ailgyfeirio i HelpwrArian. Ni fydd eich data’n cael ei gadw. Os byddwch yn gadael y gwasanaeth nawr, bydd angen i chi fewngofnodi eto gan ddefnyddio GOV.UK One Login i weld eich pensiynau.',
      'are-you-sure': 'Ydych chi’n siŵr eich bod am adael?',
      'yes-exit': 'Ydw, gadael y Dangosfwrdd',
    });
  });
});
