import React, { MouseEventHandler } from 'react';

import { Button } from '@maps-react/common/components/Button';

type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export const DownloadStatementButton = ({ onClick }: Props) => {
  return (
    <Button
      data-testid="download-statement-button"
      type="button"
      className="flex w-full py-3 px-8 bg-green-300 text-lg font-bold leading-[normal] text-blue-600 hover:bg-green-500 active:bg-green-500 active:outline-blue-600 active:text-blue-600 lg:w-auto"
      onClick={onClick}
    >
      Download PDF Statement
    </Button>
  );
};
