import { getAdminReregisterActionUrl } from 'lib/admin/detail/reregistration/reregistration';

import { Button } from '@maps-react/common/components/Button';

type AdminReregisterActionFormProps = Readonly<{
  firmId: string;
}>;

export function AdminReregisterActionForm({
  firmId,
}: AdminReregisterActionFormProps) {
  return (
    <form method="POST" action={getAdminReregisterActionUrl(firmId)}>
      <Button type="submit">Re-register</Button>
    </form>
  );
}
