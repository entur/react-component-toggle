import { useMemo } from 'react'
import { ComponentToggleContext } from './context'
import type { ComponentToggleProviderProps } from './types'

export function ComponentToggleProvider({
  flags,
  importFn,
  maxFeatureDepth,
  children,
}: ComponentToggleProviderProps) {
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
