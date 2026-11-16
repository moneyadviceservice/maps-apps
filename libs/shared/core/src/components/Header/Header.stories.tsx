import type { Meta, StoryObj } from '@storybook/nextjs';

import { Button } from '@maps-react/common/components/Button';

import { Header } from '.';

const meta: Meta<typeof Header> = {
  title: 'Components/CORE/Header',
  component: Header,
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  render: () => <Header />,
};

export const WithHeaderEndSlot: Story = {
  name: 'With headerEndSlot',
  render: () => (
    <Header
      showLanguageSwitcher={false}
      headerEndSlot={
        <Button as="a" href="#">
          Sign out
        </Button>
      }
    />
  ),
};
