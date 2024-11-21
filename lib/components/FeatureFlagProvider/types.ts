export type FeatureFlags = Record<string, boolean>

export interface FeatureFlagContextType {
  flags: FeatureFlags
  extBasePath?: string,
  isEnabled: (feature: string) => boolean
}

export interface FeatureFlagProviderProps {
  flags: FeatureFlags,
  extBasePath?: string,
  children: React.ReactNode
}
