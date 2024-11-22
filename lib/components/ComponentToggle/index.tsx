import { lazy, memo, Suspense, useMemo } from 'react';
import { ToggleFlags } from '../ComponentToggleProvider/types';
import { FeatureComponent, ComponentToggleProps } from './types';
import { useComponentToggleContext } from '../ComponentToggleProvider/context';

/**
 * A component that can load a feature component. It is a generic component that
 * lazily renders the feature component identified by the `feature` prop.
 * The component is only rendered when the corresponding feature flag is enabled.
 */
export const InternalComponentToggle = <
  Features extends ToggleFlags,
  Props extends ComponentToggleProps<Features>>({
  feature,
  renderFallback,
  ...props
}: Props) => {
  const { flags: featureFlags, componentsPath } = useComponentToggleContext();

  if (!componentsPath) {
    throw new Error('componentsPath must be provided in ComponentToggleProvider');
  }

  const splitFeature = useMemo(() => (feature as string).split('/'), [feature]);

  const Component: FeatureComponent<Props> = useMemo(() => {
    if (splitFeature.length > 2) {
      throw new Error('Max feature depth is 2');
    }

    // Use a function that returns the import() call
    const importFeature = () => {
      const path = splitFeature.length === 2
        ? `${componentsPath}/${splitFeature[0]}/${splitFeature[1]}`
        : `${componentsPath}/${splitFeature[0]}`;
      
      // Let the consuming app's build system resolve the path
      return import(/* @vite-ignore */ path);
    };

    return memo(lazy(importFeature));
  }, [splitFeature, componentsPath]);

  const featureEnabled = useMemo(
    () =>
      featureFlags &&
      Object.entries(featureFlags).some(([key, value]) => {
        return key.split('/')[0] === splitFeature[0] && value;
      }),
    [featureFlags, splitFeature],
  );

  if (!featureEnabled) {
    return renderFallback?.() ?? null;
  }

  return (
    <Suspense fallback={renderFallback?.() ?? null}>
      <Component {...(props as any)} />
    </Suspense>
  );
};

export default memo(InternalComponentToggle) as typeof InternalComponentToggle;

export type { FeatureComponent, ComponentToggleProps } from './types';