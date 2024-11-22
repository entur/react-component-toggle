import { createContext, useContext } from 'react'
import type { ComponentToggleContextType } from './types'

export const ComponentToggleContext = createContext<ComponentToggleContextType | undefined>(undefined)

export function useComponentToggleContext(): ComponentToggleContextType {
  const context = useContext(ComponentToggleContext)
  if (context === undefined) {
    throw new Error('useComponentToggleContext must be used within a ComponentToggleProvider')
  }
  return context
}

export function useComponentToggle(feature: string): boolean {
  const context = useContext(ComponentToggleContext)
  if (context === undefined) {
    throw new Error('useComponentToggle must be used within a ComponentToggleProvider')
  }
  return context.isEnabled(feature)
}