import { ComponentType } from 'react';

import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { ContentCard } from '@maps-react/common/components/ContentCard';

import { ColumnStrip } from '../../components/ColumnStrip';
import { ProsConsCards } from '../../components/ProsConsCards';

/**
 * Maps string keys to component configuration objects.
 *
 * Each entry in the mapping specifies a React component to render,
 * along with optional properties such as `variant`, `className`, and `headingClassName`.
 *
 * @remarks
 * This mapping is used to dynamically select and configure components based on a string identifier.
 *
 * @example
 * ```typescript
 * const { Component, variant, className, headingClassName } = componentMapping['Card'];
 * ```
 *
 * @property {ComponentType<any>} Component - The React component to render.
 * @property {CalloutVariant} [variant] - Optional variant for the component, if applicable.
 * @property {string} [className] - Optional CSS class for the component container.
 * @property {string} [headingClassName] - Optional CSS class for the component heading.
 */
const componentMapping: Record<
  string,
  {
    Component: ComponentType<any>;
    variant?: CalloutVariant;
    className?: string;
    headingClassName?: string;
  }
> = {
  CardGray: {
    Component: Callout,
    variant: CalloutVariant.INFORMATION_MAGENTA,
  },
  Card: {
    Component: ContentCard,
    className: 'mb-8 p-4 pt-2',
    headingClassName: 'text-blue-700',
  },
  ColumnStrip: { Component: ColumnStrip },
  ProsConsCards: { Component: ProsConsCards },
};

/**
 * Retrieves the mapped component for a given component type.
 *
 * @param componentType - The string identifier for the desired component.
 * @returns The component mapped to the specified type.
 * @throws {Error} If the provided component type is not mapped.
 */
export const getComponent = (componentType: string) => {
  const mapping = componentMapping[componentType];
  if (!mapping) {
    throw new Error(`Component type "${componentType}" is not mapped.`);
  }
  return mapping;
};
