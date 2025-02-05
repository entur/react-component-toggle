export type ToggleFlags = Record<string, boolean>

interface ComponentToggleBaseType {
  flags: ToggleFlags
  importFn: (featurePathComponents: string[]) => Promise<any>;
}

export interface ComponentToggleContextType extends ComponentToggleBaseType {
  isEnabled: (feature: string) => boolean
}

export interface ComponentToggleProviderProps extends ComponentToggleBaseType{
  children: React.ReactNode
}
