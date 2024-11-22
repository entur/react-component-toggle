export type ToggleFlags = Record<string, boolean>

export interface ComponentToggleContextType {
  flags: ToggleFlags
  componentsPath?: string,
  isEnabled: (feature: string) => boolean
}

export interface ComponentToggleProviderProps {
  flags: ToggleFlags,
  componentsPath?: string,
  children: React.ReactNode
}
