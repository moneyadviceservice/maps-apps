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
      ? '[&::-webkit-progress-value]:bg-blue-800 [&::-moz-progress-bar]:bg-blue-800'
      : '[&::-webkit-progress-value]:bg-pink-600 [&::-moz-progress-bar]:bg-pink-600',
  );

  const progress = [
    '[&::-webkit-progress-bar]:bg-white',
    '[&::-webkit-progress-value]:rounded-full',
    '[&::-moz-progress-bar]:rounded-full',
  ];
  return (
    <div data-testid={testId} className={twMerge(className)}>
      <label
        className="block mb-6 text-4xl font-bold text-center text-blue-800"
        htmlFor="progress"
      >
        {label}
      </label>
      <progress
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={twMerge(
          'w-full border-2 bg-white border-slate-400 rounded-full h-[18px] shadow-bottom-slate overflow-hidden',
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
