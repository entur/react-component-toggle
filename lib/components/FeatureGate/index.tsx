import { lazy, memo, Suspense, useMemo } from 'react';
import { FeatureFlags } from '../FeatureFlagProvider';
import { FeatureComponent, FeatureGateProps } from './types';
import { useFeatureFlagsContext } from '../FeatureFlagProvider/context';

/**
 * A component that can load a feature component. It is a generic component that
 * lazily renders the feature component identified by the `feature` prop.
 * The component is only rendered when the corresponding feature flag is enabled.
 */
export const InternalFeatureGate = <
  Features extends FeatureFlags,
  Props extends FeatureGateProps<Features>,
>({
  feature,
  renderFallback,
  ...props
}: Props) => {
  const { flags: featureFlags, extBasePath } = useFeatureFlagsContext();

  if (!extBasePath) {
    throw new Error('extBasePath must be provided in FeatureFlagProvider');
  }

  const splitFeature = useMemo(() => (feature as string).split('/'), [feature]);

  const Component: FeatureComponent<Features, Props> = useMemo(() => {
    if (splitFeature.length > 2) {
      throw new Error('Max feature depth is 2');
    }

    // Use a function that returns the import() call
    const importFeature = () => {
      const path = splitFeature.length === 2
        ? `${extBasePath}/${splitFeature[0]}/${splitFeature[1]}`
        : `${extBasePath}/${splitFeature[0]}`;
      
      // Let the consuming app's build system resolve the path
      return import(/* @vite-ignore */ path);
    };

    return memo(lazy(importFeature));
  }, [splitFeature, extBasePath]);

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

export default memo(InternalFeatureGate) as typeof InternalFeatureGate;

export type { FeatureComponent, FeatureGateProps } from './types';