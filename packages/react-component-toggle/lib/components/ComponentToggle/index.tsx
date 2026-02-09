import React, { lazy, memo, Suspense, useMemo } from 'react';
import { ComponentToggleProps } from './types';
import { useComponentToggleContext } from '../ComponentToggleProvider/context';
import { isFeatureEnabled } from '../featureUtils';

/**
 * A component that can load a feature component. It is a generic component that
 * lazily renders the feature component identified by the `feature` prop.
 * The component is only rendered when the corresponding feature flag is enabled.
 *
 * @template K - The type of feature keys
 * @template ComponentProps - The props type for the feature component
 */
export const InternalComponentToggle = <
  K extends string,
  ComponentProps extends Record<string, any>>({
  feature,
  renderFallback,
  ...props
}: ComponentToggleProps<K, ComponentProps>) => {
  const { flags: featureFlags, importFn, maxFeatureDepth = 1 } = useComponentToggleContext<K>();
  const splitFeature = useMemo(() => (feature as string).split('/'), [feature]);

  if (splitFeature.length > maxFeatureDepth) {
    throw new Error(`Max feature depth is ${maxFeatureDepth}`);
  }

  // Ensure dynamic import works as expected
  const Component = useMemo(() => {
    return lazy(() => importFn(splitFeature));
  }, [splitFeature, importFn]);

  const featureEnabled = useMemo(
    () =>
      featureFlags &&
      isFeatureEnabled(featureFlags, feature as string),
    [featureFlags, feature],
  );

  if (!featureEnabled) {
    return renderFallback?.() ?? null;
  }

  return (
    <Suspense fallback={null}>
      <Component {...(props.componentProps as ComponentProps & React.JSX.IntrinsicAttributes)}>
        {props.children}
      </Component>
    </Suspense>
  );
};

export default memo(InternalComponentToggle) as typeof InternalComponentToggle;
