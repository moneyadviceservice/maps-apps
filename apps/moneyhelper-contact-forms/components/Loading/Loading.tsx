import { Icon, IconType } from '@maps-digital/shared/ui';

import { StepComponent } from '../../lib/types';

export const Loading: StepComponent = () => {
  return (
    <div className="md:max-w-5xl">
      <Icon
        type={IconType.SPINNER}
        className="w-[90px] h-[90px] animate-spin mx-auto my-10 text-pink-600"
        data-testid="nonjs-spinner"
      />
      <p className="mb-12 text-2xl font-bold text-center">Loading...</p>
    </div>
  );
};
