import { FC, ReactNode } from "react";

/**
 * The base props interface for the ComponentToggle. It is a generic interface that
 * takes a Features type parameter which describes the available features.
 * 
 * @template Features - The type of features available
 */
export interface ComponentToggleProps<Features> {
  feature: keyof Features
  renderFallback?: () => React.ReactNode
}

/**
   * A type that describes a feature component which can be wrapped with the ComponentToggle.
   * 
   * This type is used to define the type of a component that can be used with ComponentToggle. The component
   * should implement the ComponentToggleProps interface. The resulting type is a Functional Component
   * that takes the specified Props type as its props.
   */
export type FeatureComponent<
    Features,
    Props extends ComponentToggleProps<Features>,
> = React.FunctionComponent<Props>;