import {
  getAdminDirectoryStatusActionUrl,
  type DirectoryStatusAction,
} from 'lib/admin/detail/directoryStatus/directoryStatus';

import { Button } from '@maps-react/common/components/Button';

type AdminDirectoryActionFormProps = Readonly<{
  firmId: string;
  action: DirectoryStatusAction;
  label: string;
}>;

export function AdminDirectoryActionForm({
  firmId,
  action,
  label,
}: AdminDirectoryActionFormProps) {
  return (
    <form
      method="POST"
      action={getAdminDirectoryStatusActionUrl(firmId, action)}
    >
      <Button type="submit">{label}</Button>
    </form>
  );
}
