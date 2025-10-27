'use client';

import { twMerge } from 'tailwind-merge';

export enum VariantType {
  BLUE = 'blue',
  PINK = 'pink',
}

export type ProgressBarProps = {
  value: number;
  label: string;
  max: number;
  variant?: VariantType;
  testId?: string;
  className?: string;
};

export const ProgressBar = ({
  value,
  label,
  max,
  variant = VariantType.PINK,
  testId = 'progress',
  className,
}: ProgressBarProps) => {
  const variantClasses = twMerge(
    variant === VariantType.BLUE
      ? '[&::-webkit-progress-value]:bg-blue-700 [&::-moz-progress-bar]:bg-blue-700'
      : '[&::-webkit-progress-value]:bg-magenta-500 [&::-moz-progress-bar]:bg-magenta-500',
  );

  const progress = [
    '[&::-webkit-progress-bar]:bg-gray-150',
    '[&::-webkit-progress-value]:rounded-full',
    '[&::-moz-progress-bar]:rounded-full',
  ];

  return (
    <div data-testid={testId} className={twMerge(className)}>
      <label
        className="block mb-3 text-2xl font-bold text-center md:mb-8 text-magenta-500 md:text-4xl"
        htmlFor="progress"
      >
        {label}
      </label>
      <progress
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={twMerge(
          'w-full border-1 bg-white border-gray-650 rounded-full h-[16px] overflow-hidden',
          progress,
          variantClasses,
        )}
        id="progress"
        value={value}
        max={max}
      />
    </div>
  );
};
