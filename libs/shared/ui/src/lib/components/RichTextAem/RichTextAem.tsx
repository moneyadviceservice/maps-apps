import { ReactNode } from 'react';
import classNames from 'classnames';

export enum VariantType {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
}

export type RichTextAemProps = {
  children: ReactNode;
  testId?: string;
  className?: string;
  listVariant?: VariantType;
};

export const RichTextAem = ({
  children,
  testId = 'rich-text',
  className,
  listVariant,
}: RichTextAemProps) => {
  const listClasses = [
    '[&_ul]:mb-[1rem]',
    '[&_ul>li]:pl-[0.5rem]',
    '[&_ul>li]:ml-[0.5rem]',
    '[&_ul>li::marker]:text-[0.6em]',
    '[&_ol]:mb-[1rem]',
    '[&_ol>li]:ml-[0.5rem]',
    '[&_ol>li]:pl-[0.5rem]',
    '[&_ol]:list-decimal',
  ];

  const listIconClasses = [
    `[&_ul]:pl-0`,
    `[&_ul>li]:ml-[0px]`,
    `[&_ul>li]:mb-3`,
    `[&_ul>li]:pl-[2rem]`,
    '[&_ul>li]:list-none',
    '[&_ul>li]:relative',
    `[&_ul>li:before]:content-['']`,
    `[&_ul>li:before]:block`,
    `[&_ul>li:before]:absolute`,
    `[&_ul>li:before]:left-0`,
    `[&_ul>li:before]:top-2`,
    `[&_ul>li:before]:bg-cover`,
    `[&_ul>li:before]:bg-no-repeat`,
  ];

  const tickListClasses = [
    `[&_ul>li:before]:bg-tick_green`,
    `[&_ul>li:before]:w-[20px]`,
    `[&_ul>li:before]:h-[14px]`,
  ];

  const crossListClasses = [
    `[&_ul>li:before]:bg-cross_red`,
    `[&_ul>li:before]:w-[15px]`,
    `[&_ul>li:before]:h-[15px]`,
  ];

  const variantClasses =
    listVariant &&
    listIconClasses.concat(
      listVariant === VariantType.POSITIVE ? tickListClasses : crossListClasses,
    );

  return (
    <div
      className={classNames([listClasses, variantClasses, className])}
      data-testid={testId}
    >
      {children}
    </div>
  );
};
