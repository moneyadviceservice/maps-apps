import { PensionType } from '../../constants';

const PensionTypeStyles: Record<
  string,
  {
    border: string;
    bgDark: string;
    bgLight?: string;
    text?: string;
    potText?: string;
    fill?: string;
    stroke?: string;
  }
> = {
  [PensionType.AVC]: {
    border: 'border-magenta-850',
    bgDark: 'bg-magenta-850',
    bgLight: 'bg-pink-300/40',
    text: 'text-magenta-850',
    potText: 'text-magenta-850',
    fill: 'fill-magenta-850',
    stroke: 'stroke-magenta-850',
  },
  [PensionType.DB]: {
    border: 'border-purple-650',
    bgDark: 'bg-purple-650',
    bgLight: 'bg-purple-100',
    text: 'text-purple-650',
    potText: 'text-purple-650',
    fill: 'fill-purple-650',
    stroke: 'stroke-purple-650',
  },
  [PensionType.DC]: {
    border: 'border-teal-700',
    bgDark: 'bg-teal-700',
    bgLight: 'bg-teal-100',
    text: 'text-teal-700',
    potText: 'text-teal-700',
    fill: 'fill-teal-700',
    stroke: 'stroke-teal-700',
  },
  [PensionType.HYB]: {
    border: 'border-olive-500',
    bgDark: 'bg-olive-500',
    bgLight: 'bg-yellow-300/65',
    text: 'text-olive-800',
    potText: 'text-olive-500',
    fill: 'fill-olive-500',
    stroke: 'stroke-olive-500',
  },
  [PensionType.CDC]: {
    border: 'border-amber-800',
    bgDark: 'bg-amber-800',
    bgLight: 'bg-yellow-150',
    text: 'text-amber-850',
    potText: 'text-amber-850',
    fill: 'fill-amber-800',
    stroke: 'stroke-amber-800',
  },
  [PensionType.CB]: {
    border: 'border-gray-600',
    bgDark: 'bg-gray-600',
    bgLight: 'bg-tan-500/40',
    text: 'text-gray-600',
    potText: 'text-gray-600',
    fill: 'fill-gray-600',
    stroke: 'stroke-gray-600',
  },
  [PensionType.VAR]: {
    border: 'border-purple-900',
    bgDark: 'bg-purple-900',
    bgLight: 'bg-peach-500/40',
    text: 'text-purple-900',
    potText: 'text-purple-900',
    fill: 'fill-purple-900',
    stroke: 'stroke-purple-900',
  },
  [PensionType.SP]: {
    border: 'border-blue-700',
    bgDark: 'bg-blue-700',
  },
  ['DEFAULT']: {
    border: 'border-gray-300',
    bgDark: 'bg-slate-200',
    bgLight: 'bg-slate-200',
    text: 'text-blue-900',
    potText: 'text-blue-900',
  },
};

export const getPensionTypeClasses = (type: PensionType | undefined) => {
  const base = PensionTypeStyles[type ?? 'DEFAULT'];

  return {
    borderClass: base.border,
    bgDarkClass: base.bgDark,
    bgLightClass: base.bgLight ?? undefined,
    textClass: base.text ?? undefined,
    fillClass: base.fill ?? undefined,
    potTextClass: base.potText ?? undefined,
    strokeClass: base.stroke ?? undefined,
  };
};
