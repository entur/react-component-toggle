# react-component-toggle

Make any React component feature-flaggable with full type safety and lazy loading.

Features are controlled by feature flags. The component toggle is designed to support code splitting, 
so that each feature will be compiled into separate chunks. React will then postpone the downloading 
of any given chunk until it decides it's time to render the component inside.

This library consists of two components:

- `ComponentToggle` - a component that is only rendered when its toggle flag is enabled.
- `ComponentToggleProvider` - a component that provides the toggle configuration context.

## How to develop a feature

Features are placed in a folder with the same name as the feature. The feature name should be added
to the Features interface.

The folder should have an index.ts, with a default export. The default
export should be the main entry (React) component of your feature.

Example with a feature called `foobar`:

    //  ext/foobar/index.ts
    const Foobar: FeatureComponent<Features, FoobarProps> = (props) => {
        return (
            <h1>{props.foo}</h1>
        )
    };

    export default Foobar;

The folder must also have
a types.d.ts file which exports the props type declaration for your component.

    // ext/foobar/types.d.ts
    export interface FoobarProps extends ComponentToggleProps<Features> {
        foo: string;
    }

This ensures type safety across the ComponentToggle wrapper without having an explicit dependency
to your component's runtime code.

To use your feature in the main code, you'll use the ComponentToggle:

    <ComponentToggle<FoobarProps>
        feature="foobar"
        foo="bar"
    />

If "foobar" is `false` in your feature flags configuration, this will not render anything.
If "foobar" is `true` it will render:

    <h1>bar</1>

A `renderFallback` function prop is also available to give the option to render something else
if the feature is not enabled:

    <ComponentToggle<FoobarProps>
        feature="foobar"
        foo="bar"
        renderFallback={() => <h1>foo</h1>}
    />

will render

    <h1>foo</h1>

if feature `foobar` is not enabled.

## Configuration

The `ComponentToggleProvider` component requires two props:

- `flags`: An object containing your feature flags configuration
- `componentsPath`: The base path to your feature components directory

Example:

```tsx
const flags = {
  foobar: true
}

<ComponentToggleProvider 
  flags={flags}
  componentsPath="/src/ext" // Points to where your feature components are located
>
  <App />
</ComponentToggleProvider>
```

The `componentsPath` should point to the directory where your feature components are located relative to your application's root. This is necessary for proper code splitting and dynamic imports to work.

For example, if your feature components are in:
```
your-app/
  src/
    ext/
      foobar/
        index.tsx
```

Then you would set `componentsPath="/src/ext"`.

## How features are controlled by configuration

First of all, you must add each feature to the `Features` interface in `../config/config.ts`:

    interface Features {
        foobar: boolean;
    }

The `features` property of the bootstrap configuration controls each individual feature. By default,
all features are turned off, and must be explicitly set to be enabled:

    {
        "features": {
            "foobar": true
        }
    }

## Nested features

`ComponentToggle` supports nesting features 2 levels deep. Meaning, you can group several features into one
mega-feature, and configure them as one. They will also be chunked together as one file.

Example, given the following folder structure:

    // ext/foobar/foo/
    // ext/foobar/bar/

And the following feature definition:

    foobar: boolean;

and configuration setting:

    foobar: true

You can reference each sub-level feature as follows:

    <ComponentToggle<FoobarProps>
        feature="foobar/foo"
        foo="bar"
    />

and

    <ComponentToggle<FoobarProps>
        feature="foobar/bar"
        bar="foo"
    />

## How to include stylesheets in feature components

Importing stylesheets directly must be avoided, because the bundler will preload it regardless of the configuration.
Therefore, stylesheets must be imported using the `url` option, and rendered inside `Helmet`:

    import stylesheetUrl from './styles.scss?url';
    import Helmet from 'react-helmet';

    export const SomeComponent = () => {
        return (
            <>
                <Helmet>
                    <link href={stylesheetUrl} rel="stylesheet" media="all" />
                </Helmet>
                <p>My content</p>
            </>
        );
    }