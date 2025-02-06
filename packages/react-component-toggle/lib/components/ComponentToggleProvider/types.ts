export type ToggleFlags = Record<string, boolean>

type Module = {
  default: React.ComponentType<any>;
}

interface ComponentToggleBaseType {
  flags: ToggleFlags
  importFn: (featurePathComponents: string[]) => Promise<Module>;
  maxFeatureDepth?: number;
}

export interface ComponentToggleContextType extends ComponentToggleBaseType {
  isEnabled: (feature: string) => boolean
}

export interface ComponentToggleProviderProps extends ComponentToggleBaseType{
  children: React.ReactNode
}
