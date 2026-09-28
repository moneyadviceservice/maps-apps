import { render, screen } from '@testing-library/react';

import { SidebarType, StepName } from '../../lib/constants';
import { BookingFormsLayout, getSidebarContent } from './';

jest.mock('@maps-react/mhf/utils/getCurrentStep', () => ({
  getCurrentStep: jest.fn(),
}));

jest.mock('../../routes/routeConfig', () => ({
  routeConfig: {
    'step-0': {
      Component: jest.fn(),
      guards: [],
      sidebarType: 'help',
    },
    'step-1': {
      Component: jest.fn(),
      guards: [],
      hideTitle: true,
      hideSidebar: true,
      hideBackStep: true,
    },
  },
}));

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
  it('renders correctly', async () => {
    const { container } = render(
      <BookingFormsLayout step={StepName.APPOINTMENT_TYPE}>
        test content
      </BookingFormsLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('does not render sidebar content when hideSidebar is true', () => {
    const { container } = render(
      <BookingFormsLayout step={'step-0'} hideSidebar={true}>
        test content
      </BookingFormsLayout>,
    );
    expect(screen.queryByRole('aside')).toBeNull();
    expect(container).toMatchSnapshot();
  });

  it('does not render the back link when the route hides it', () => {
    render(
      <BookingFormsLayout step={'step-1'} back={'step-0'}>
        test content
      </BookingFormsLayout>,
    );

    expect(screen.queryByRole('link', { name: 'Back' })).toBeNull();
  });

  it('hides the title if hideTitle is true', async () => {
    const { container } = render(
      <BookingFormsLayout step={'step-1'}>test content</BookingFormsLayout>,
    );
    expect(container).toMatchSnapshot();
    expect(screen.queryByTestId('step-1-title')).toBeNull();
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
});
