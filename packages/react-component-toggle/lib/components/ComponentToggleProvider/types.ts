/**
 * Base type for feature flags configuration.
 * Each key represents a feature name and its boolean value indicates if the feature is enabled.
 * @template K - The type of feature keys
 */
export type ToggleFlags<K extends string = string> = Record<K, boolean>

/**
 * Module type representing a dynamically imported component.
 */
type Module = {
  default: React.ComponentType<any>;
}

/**
 * Base configuration type for the ComponentToggle system.
 * @template K - The type of feature keys
 */
interface ComponentToggleBaseType<K extends string = string> {
  /** Feature flags configuration object */
  flags: ToggleFlags<K>
  /** Function to dynamically import feature components */
  importFn: (featurePathComponents: string[]) => Promise<Module>;
  /** Maximum allowed depth for nested features. Defaults to 1 */
  maxFeatureDepth?: number;
}

/**
 * Extended context type that includes methods for checking feature status.
 * @template K - The type of feature keys
 */
export interface ComponentToggleContextType<K extends string = string> extends ComponentToggleBaseType<K> {
  /** Function to check if a specific feature is enabled */
  isEnabled: (feature: K) => boolean
}

/**
 * Props interface for the ComponentToggleProvider component.
 * @template K - The type of feature keys
 */
export interface ComponentToggleProviderProps<K extends string = string> extends ComponentToggleBaseType<K> {
  /** Child components that need access to feature flags */
  children: React.ReactNode
}
