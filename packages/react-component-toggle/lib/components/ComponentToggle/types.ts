/**
 * Type for feature paths, including nested features.
 * Allows both top-level feature names and nested feature paths (e.g. "feature/subfeature")
 * @template K - The type of feature keys
 */
export type FeaturePath<K extends string> = K | `${K}/${string}`;

/**
 * The base props interface for the ComponentToggle. It is a generic interface that
 * takes a Features type parameter which describes the available features.
 *
 * @template K - The type of feature keys
 * @template ComponentProps - The props type for the feature component
 */
export interface ComponentToggleProps<K extends string, ComponentProps> {
  /**
   * The feature to load. Can be either a top-level feature name or a nested feature path
   * (e.g. "feature/subfeature")
   */
  feature: FeaturePath<K>
  /**
   * Optional function to render a fallback component when the feature is disabled
   * or while the feature component is loading
   */
  renderFallback?: () => React.ReactNode
  /**
   * Props to pass to the feature component
   */
  componentProps?: ComponentProps
  /**
   * Optional children to pass to the feature component
   */
  children?: React.ReactNode
}

/**
 * A type that describes a feature component which can be wrapped with the ComponentToggle.
 *
 * This type is used to define the type of a component that can be used with ComponentToggle. The component
 * should implement the ComponentToggleProps interface. The resulting type is a Functional Component
 * that takes the specified Props type as its props.
 */
export type FeatureComponent<Props> = React.FunctionComponent<Props>;
