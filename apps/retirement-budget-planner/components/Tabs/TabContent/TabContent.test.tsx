import { render } from '@testing-library/react';
import TabContent from './TabContent';

describe('TabContent component', () => {
  it('should display the component with title', () => {
    const { container } = render(
      <TabContent title={'About us'} tabName={'about-us'}>
        Tab content
      </TabContent>,
    );

    expect(container.getElementsByTagName('h1')).toBeTruthy();
    expect(container.getElementsByTagName('h1')[0]?.innerHTML).toBe('About us');
  });

  it('should display the component with description', () => {
    const { container } = render(
      <TabContent
        title={'Retirement'}
        tabName={'retirement'}
        description="Tab specific description"
      >
        Tab content
      </TabContent>,
    );

    expect(container.getElementsByTagName('p')).toBeTruthy();
    expect(container.getElementsByTagName('p')[0]?.innerHTML).toBe(
      'Tab specific description',
    );
  });
});
