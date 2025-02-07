import { useMemo } from 'react'
import { ComponentToggleContext } from './context'
import type { ComponentToggleProviderProps } from './types'

/**
 * Provider component that manages feature flags and component imports for the ComponentToggle system.
 * This provider must wrap any component that uses ComponentToggle or the useComponentToggle hook.
 * 
 * @param props - The provider configuration props
 * @param props.flags - Feature flags configuration object
 * @param props.importFn - Function to dynamically import feature components
 * @param props.maxFeatureDepth - Maximum allowed depth for nested features (defaults to 1)
 * @param props.children - Child components that need access to feature flags
 * @throws {Error} When importFn is not provided
 */
export function ComponentToggleProvider({
  flags,
  importFn,
  maxFeatureDepth,
  children,
}: ComponentToggleProviderProps) {
  if (!importFn) {
    throw new Error('importFn is required')
  }

  const context = useMemo(
    () => ({
      flags,
      importFn,
      maxFeatureDepth,
      isEnabled: (feature: string) => {
        return flags[feature] ?? false
      },
    }),
    [flags, importFn, maxFeatureDepth],
  )

  return (
    <ComponentToggleContext.Provider value={context}>
      {children}
    </ComponentToggleContext.Provider>
  )
}

export default ComponentToggleProvider
