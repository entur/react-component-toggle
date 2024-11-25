import { useMemo } from 'react'
import { ComponentToggleContext } from './context'
import type { ComponentToggleProviderProps } from './types'

export function ComponentToggleProvider({
  flags,
  componentsPath,
  children,
}: ComponentToggleProviderProps) {
  const context = useMemo(
    () => ({
      flags,
      componentsPath,
      isEnabled: (feature: string) => {
        return flags[feature] ?? false
      },
    }),
    [flags, componentsPath],
  )

  return (
    <ComponentToggleContext.Provider value={context}>
      {children}
    </ComponentToggleContext.Provider>
  )
}

export default ComponentToggleProvider