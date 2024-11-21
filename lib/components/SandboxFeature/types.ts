import { FC, ReactNode } from "react";

/**
 * The base props interface for the SandboxFeature component. It is a generic interface that
 * takes a single type parameter `Features`, and has  a single property `feature` which can
 * have the value of any key of `Features`.
 */
export interface SandboxFeatureProps<Features> {
    feature: keyof Features;
    renderFallback?: () => ReactNode;
  }
  
  /**
   * A type that describes a sandbox component which can be wrapped with the SandboxFeature component.
   * It is a generic type which takes two type parameters: `Features` and `Props`. The `Props` type
   * should implement the SandboxFeatureProps interface. The resulting type is a Functional Component
   * with `Props` without "feature".
   */
  export type SandboxComponent<
    Features,
    Props extends SandboxFeatureProps<Features>,
  > = FC<Omit<Props, 'feature' | 'renderFallback'>>;