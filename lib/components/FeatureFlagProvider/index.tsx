import { FeatureFlagContext } from './context'
import type { FeatureFlagContextType, FeatureFlagProviderProps } from './types'

export function FeatureFlagProvider({ flags, extBasePath, children }: FeatureFlagProviderProps) {
  const isEnabled = (feature: string): boolean => {
    return Boolean(flags[feature])
  }

  const value: FeatureFlagContextType = {
    flags,
    extBasePath,
    isEnabled,
  }

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  )
}

export type { FeatureFlags } from './types';