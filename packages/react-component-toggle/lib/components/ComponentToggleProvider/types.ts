/**
 * Base type for feature flags configuration.
 * Each key represents a feature name and its boolean value indicates if the feature is enabled.
 */
export type ToggleFlags = Record<string, boolean>

/**
 * Module type representing a dynamically imported component.
 */
type Module = {
  default: React.ComponentType<any>;
}

/**
 * Base configuration type for the ComponentToggle system.
 */
interface ComponentToggleBaseType {
  /** Feature flags configuration object */
  flags: ToggleFlags
  /** Function to dynamically import feature components */
  importFn: (featurePathComponents: string[]) => Promise<Module>;
  /** Maximum allowed depth for nested features. Defaults to 1 */
  maxFeatureDepth?: number;
}

/**
 * Extended context type that includes methods for checking feature status.
 */
export interface ComponentToggleContextType extends ComponentToggleBaseType {
  /** Function to check if a specific feature is enabled */
  isEnabled: (feature: string) => boolean
}

/**
 * Props interface for the ComponentToggleProvider component.
 */
export interface ComponentToggleProviderProps extends ComponentToggleBaseType {
  /** Child components that need access to feature flags */
  children: React.ReactNode
}
