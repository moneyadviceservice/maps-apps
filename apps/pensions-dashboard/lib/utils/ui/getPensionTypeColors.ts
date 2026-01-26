import { PensionType } from '../../constants';

const PensionTypeStyles: Record<
  string,
  {
    border: string;
    bgDark: string;
    bgLight?: string;
    text?: string;
    fill?: string;
    stroke?: string;
  }
> = {
  [PensionType.AVC]: {
    border: 'border-magenta-750',
    bgDark: 'bg-magenta-750',
    bgLight: 'bg-pink-300/40',
    text: 'text-magenta-750',
    fill: 'fill-magenta-750',
    stroke: 'stroke-magenta-750',
  },
  [PensionType.DB]: {
    border: 'border-purple-650',
    bgDark: 'bg-purple-650',
    bgLight: 'bg-purple-100',
    text: 'text-purple-650',
    fill: 'fill-purple-650',
    stroke: 'stroke-purple-650',
  },
  [PensionType.DC]: {
    border: 'border-teal-700',
    bgDark: 'bg-teal-700',
    bgLight: 'bg-teal-100',
    text: 'text-teal-700',
    fill: 'fill-teal-700',
    stroke: 'stroke-teal-700',
  },
  [PensionType.HYB]: {
    border: 'border-olive-500',
    bgDark: 'bg-olive-500',
    bgLight: 'bg-yellow-300/65',
    text: 'text-olive-800',
    fill: 'fill-olive-500',
    stroke: 'stroke-olive-500',
  },
  [PensionType.SP]: {
    border: 'border-blue-700',
    bgDark: 'bg-blue-700',
  },
};

export const getPensionTypeClasses = (type: PensionType) => {
  const base = PensionTypeStyles[type];
  return {
    borderClass: base.border,
    bgDarkClass: base.bgDark,
    bgLightClass: base.bgLight ?? undefined,
    textClass: base.text ?? undefined,
    fillClass: base.fill ?? undefined,
    strokeClass: base.stroke ?? undefined,
  };
};
