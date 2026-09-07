import { HTMLAttributes } from 'react';

import { twMerge } from 'tailwind-merge';

export type Level = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: Level;
  fontWeight?: string;
  component?: React.ElementType;
  variant?: 'primary' | 'secondary';
}

export const Heading = ({
  level = 'h1',
  color = 'text-gray-800',
  fontWeight = 'font-bold',
  variant = 'primary',
  component,
  children,
  className,
  ...props
}: HeadingProps) => {
  const Component = component ?? level;
  const classes = {
    h1: `text-4xl md:text-6xl ${color} ${fontWeight} `,
    h2: `text-3xl md:text-5xl ${color} ${fontWeight}`,
    h3: `text-2xl md:text-4xl ${color} ${fontWeight}`,
    h4: `text-xl md:text-2xl ${color} ${fontWeight}`,
    h5: `text-lg md:text-xl ${color} ${fontWeight}`,
    h6: `text-base ${color} ${fontWeight}`,
  }[level];

  return (
    <Component
      className={twMerge(
        classes,
        className,
        variant === 'secondary' && 'text-blue-700',
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

// @note to make it easier to replace existing headings
export const H1 = (props: HeadingProps) => (
  <Heading {...props} level="h1">
    {props.children}
  </Heading>
);

export const H2 = (props: HeadingProps) => (
  <Heading {...props} level="h2">
    {props.children}
  </Heading>
);

export const H3 = (props: HeadingProps) => (
  <Heading {...props} level="h3">
    {props.children}
  </Heading>
);

export const H4 = (props: HeadingProps) => (
  <Heading {...props} level="h4">
    {props.children}
  </Heading>
);

export const H5 = (props: HeadingProps) => (
  <Heading {...props} level="h5">
    {props.children}
  </Heading>
);

export const H6 = (props: HeadingProps) => (
  <Heading {...props} level="h6">
    {props.children}
  </Heading>
);
