import { useRouter } from 'next/router';
import { useEffect } from 'react';

declare global {
  interface Window {
    adobeDataLayer: Array<Record<string, unknown>>;
  }
}

const ToolSteps = {
  start: '1',
  age: '2',
  'under-50': '2.1',
  '50-54': '2.2',
  '75-and-over': '2.3',
  'pension-type': '3',
  'no-dc-pension': '3.1',
  'terminal-illness': '4',
  'coping-with-terminal-illness': '4.1',
  'lifetime-annuity': '5',
  'lifetime-annuity-in-payment': '5.1',
  debts: '6',
  'debt-advice': '7',
  'have-not-received-debt-advice': '7.1',
  'pension-wise-appointment': '8',
  'pension-basics': '9',
  'protecting-your-pension': '9.1',
  'keeping-track-of-pensions': '9.2',
  'transferring-pension': '9.3',
  'income-savings': '10',
  'retirement-budget': '10.1',
  'state-pension': '10.2',
  'state-benefits': '10.3',
  'debt-repayment': '11',
  'using-pension-to-pay-debt': '11.1',
  'your-home': '12',
  'live-overseas': '12.1',
  'health-family': '13',
  will: '13.1',
  'power-of-attorney': '13.2',
  'retire-later-or-delay': '14',
  'guaranteed-income': '15',
  'flexible-income': '16',
  'lump-sums': '17',
  'take-pot-in-one': '18',
  'mix-options': '19',
  summary: '20',
  save: '21',
  'progress-saved': '22',
};

export const useAdobeDataLayer = (toolName: string): void => {
  const router = useRouter();
  const pageName = router.pathname
    ? router.pathname.split('/').slice(-1)[0]
    : '';
  const stepName = pageName.replace(/-/g, ' ');
  const toolStep = ToolSteps[pageName as keyof typeof ToolSteps];

  useEffect(() => {
    const updateAdobeDataLayer = (): void => {
      window.adobeDataLayer = window.adobeDataLayer || [];

      window.adobeDataLayer.push({
        event: 'pageLoad',
        page: {
          pageName,
          pageTitle: document.title,
          lang: router.query.language === 'cy' ? 'cy' : 'en',
          site: 'moneyhelper',
          pageType: 'tool page',
        },
        tool: {
          toolName,
          toolCategory: '',
          toolStep,
          stepName,
        },
      });
    };

    updateAdobeDataLayer();
  }, [router.query.language, toolName, toolStep, stepName, pageName]);
};
