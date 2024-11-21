import { createContext, useContext } from 'react'
import type { FeatureFlagContextType } from './types'

export const FeatureFlagContext = createContext<FeatureFlagContextType | null>(null)

export function useFeatureFlag(feature: string): boolean {
    const context = useContext(FeatureFlagContext)
    if (!context) {
      throw new Error('useFeatureFlag must be used within a FeatureFlagProvider')
    }
    return context.isEnabled(feature)
  }
  
  export function useFeatureFlagsContext(): FeatureFlagContextType {
    const context = useContext(FeatureFlagContext)
    if (!context) {
      throw new Error('useFeatureFlags must be used within a FeatureFlagProvider')
    }
    return context;
  }