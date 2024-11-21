import { lazy, memo, Suspense, useMemo } from 'react';
import { FeatureFlags } from '../FeatureFlagProvider';
import { SandboxComponent, SandboxFeatureProps } from './types';
import { useFeatureFlagsContext } from '../FeatureFlagProvider/context';

/**
 * A component that can load a sandbox Component. It is a generic component with the same type
 * parameters as the SandboxComponent. It optionally and lazily renders the SandboxComponent
 * identified by through the `feature` prop, which identifies the path of the component to load.
 */
export const InternalSandboxFeature = <
  Features extends FeatureFlags,
  Props extends SandboxFeatureProps<Features>,
>({
  feature,
  renderFallback,
  ...props
}: Props) => {
  const { flags: sandboxFeatures, extBasePath } = useFeatureFlagsContext();

  if (!extBasePath) {
    throw new Error('extBasePath must be provided in FeatureFlagProvider');
  }

  const splitFeature = useMemo(() => (feature as string).split('/'), [feature]);

  const Component: SandboxComponent<Features, Props> = useMemo(() => {
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
      sandboxFeatures &&
      Object.entries(sandboxFeatures).some(([key, value]) => {
        return key.split('/')[0] === splitFeature[0] && value;
      }),
    [sandboxFeatures, splitFeature],
  );

  return (
    <Suspense>
      {featureEnabled ? (
        <Component {...props} />
      ) : renderFallback ? (
        renderFallback()
      ) : null}
    </Suspense>
  );
};

export default memo(InternalSandboxFeature) as typeof InternalSandboxFeature;

export type {SandboxComponent, SandboxFeatureProps} from './types';