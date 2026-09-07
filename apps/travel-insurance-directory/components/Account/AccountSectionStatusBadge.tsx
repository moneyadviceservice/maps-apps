export type AccountSectionStatus = 'completed' | 'in_progress' | 'not_started';

const badgeClassNames: Record<AccountSectionStatus, string> = {
  completed: 'bg-green-700 text-white',
  in_progress: 'bg-magenta-750 text-white',
  not_started: 'bg-gray-100 text-magenta-700',
};

const badgeLabels: Record<AccountSectionStatus, string> = {
  completed: 'completed',
  in_progress: 'in progress',
  not_started: 'not started',
};

export type AccountSectionStatusBadgeProps = Readonly<{
  status: AccountSectionStatus;
}>;

export const AccountSectionStatusBadge = ({
  status,
}: AccountSectionStatusBadgeProps) => (
  <span
    className={`inline-block px-2 py-1 text-base ${badgeClassNames[status]}`}
    data-testid="account-section-link-value"
  >
    {badgeLabels[status]}
  </span>
);
