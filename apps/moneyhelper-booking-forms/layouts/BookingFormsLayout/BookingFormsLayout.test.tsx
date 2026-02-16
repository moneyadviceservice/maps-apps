import { render } from '@testing-library/react';

import { mockSteps } from '@maps-react/mhf/mocks';

import { SidebarType } from '../../lib/constants';
import { BookingFormsLayout, getSidebarContent } from './';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
    };
  },
}));

describe('BookingFormLayout', () => {
  it('renders correctly', () => {
    const { container } = render(
      <BookingFormsLayout step={mockSteps[0]}>test content</BookingFormsLayout>,
    );
    expect(container).toMatchSnapshot();
  });
});

describe('getSidebarContent', () => {
  it('returns HelpSidebar for HELP sidebar type', () => {
    const sidebar = getSidebarContent(SidebarType.HELP);
    expect(sidebar).toMatchSnapshot();
  });

  it('returns Information Sidebar Content for INFORMATION sidebar type', () => {
    const sidebar = getSidebarContent(SidebarType.INFORMATION);
    expect(sidebar).toMatchSnapshot();
  });

  it('returns undefined for undefined sidebar type', () => {
    const sidebar = getSidebarContent(undefined);
    expect(sidebar).toBeUndefined();
  });
});
