import { createContext, useContext } from 'react'
import type { ComponentToggleContextType } from './types'

export const ComponentToggleContext = createContext<ComponentToggleContextType | undefined>(undefined)

/**
 * Hook to access the ComponentToggle context.
 * Must be used within a ComponentToggleProvider.
 * @throws {Error} If used outside of a ComponentToggleProvider
 * @returns The ComponentToggle context value
 */
export function useComponentToggleContext(): ComponentToggleContextType {
  const context = useContext(ComponentToggleContext)
  if (context === undefined) {
    throw new Error('useComponentToggleContext must be used within a ComponentToggleProvider')
  }
  return context
}

/**
 * Hook to check if a specific feature is enabled.
 * Must be used within a ComponentToggleProvider.
 * @param feature - The feature name to check
 * @returns boolean indicating if the feature is enabled
 * @throws {Error} If used outside of a ComponentToggleProvider
 */
export function useComponentToggle(feature: string): boolean {
  const context = useContext(ComponentToggleContext)
  if (context === undefined) {
    throw new Error('useComponentToggle must be used within a ComponentToggleProvider')
  }
  return context.isEnabled(feature)
}