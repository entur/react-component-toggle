# @entur/react-component-toggle

Make any React component feature-flaggable with full type safety and lazy loading.

Features are controlled by feature flags. The component toggle is designed to support code splitting, 
so that each feature will be compiled into separate chunks. React will then postpone the downloading 
of any given chunk until it decides it's time to render the component inside.

To enable code splitting for your feature components, you'll need to use the companion Rollup plugin [@entur/rollup-plugin-react-component-toggle](../rollup-plugin). See its documentation for setup instructions.

This library consists of two components:

- `ComponentToggle` - a component that lazily loads and renders feature components based on feature flags. It only loads and renders the component when its corresponding feature flag is enabled.
- `ComponentToggleProvider` - a component that provides the feature flags configuration and component path context.

## Installation

```bash
npm install @entur/react-component-toggle
# or
yarn add @entur/react-component-toggle
# or
pnpm add @entur/react-component-toggle
```

For code splitting support, also install the companion Rollup plugin:

```bash
npm install --save-dev @entur/rollup-plugin-react-component-toggle
```

## How to develop a feature

Features are placed in a folder with the same name as the feature. The feature name should be added
to your application's Features type.

The folder should have an index.tsx, with a default export. The default
export should be the main entry (React) component of your feature.

Example with a feature called `foobar`:

```tsx
//  src/components/foobar/index.tsx
const Foobar: FeatureComponent<Features, FoobarProps> = (props) => {
    return (
        <h1>{props.foo}</h1>
    )
};

export default Foobar;
```

The folder must also have a types.ts file which exports the props type declaration for your component.

```typescript
// src/components/foobar/types.ts
export interface FoobarProps extends ComponentToggleProps<Features> {
    foo: string;
}
```

This ensures type safety across the ComponentToggle wrapper without having an explicit dependency
to your component's runtime code.

To use your feature in the main code, you'll use the ComponentToggle:

```tsx
<ComponentToggle<FoobarProps>
    feature="foobar"
    foo="bar"
/>
```

If "foobar" is `false` in your feature flags configuration, this will not render anything.
If "foobar" is `true` it will render:

```html
<h1>bar</h1>
```

A `renderFallback` function prop is also available to give the option to render something else
if the feature is not enabled:

```tsx
<ComponentToggle<FoobarProps>
    feature="foobar"
    foo="bar"
    renderFallback={() => <h1>foo</h1>}
/>
```

will render

```html
<h1>foo</h1>
```

if feature `foobar` is not enabled.

## Configuration

The `ComponentToggleProvider` component requires two props:

- `flags`: An object containing your feature flags configuration
- `componentsPath`: The base path to your feature components directory

Example:

```tsx
// Define your Features type
interface Features {
    foobar: boolean;
}

// Configure your feature flags
const flags = {
  foobar: true
}

// Wrap your app with the provider
<ComponentToggleProvider 
  flags={flags}
  componentsPath="/src/components" // Points to where your feature components are located
>
  <App />
</ComponentToggleProvider>
```

The `componentsPath` should point to the directory where your feature components are located relative to your application's root. This is necessary for proper code splitting and dynamic imports to work.

For example, if your feature components are in:
```
your-app/
  src/
    components/
      foobar/
        index.tsx
```

Then you would set `componentsPath="/src/components"`.

## How features are controlled by configuration

First, define your Features type in your application:

```typescript
// src/types/features.ts
export interface Features {
    foobar: boolean;
}
```

Then configure your features through the flags prop. By default,
all features are turned off, and must be explicitly set to be enabled:

```typescript
const flags = {
    features: {
        foobar: true
    }
}
```

## Nested features

`ComponentToggle` supports nesting features 2 levels deep. Meaning, you can group several features into one
mega-feature, and configure them as one. They will also be chunked together as one file.

Example, given the following folder structure:

```
src/
  components/
    foobar/
      foo/
        index.tsx
      bar/
        index.tsx
```

And the following feature definition:

```typescript
interface Features {
    foobar: boolean;
}
```

and configuration setting:

```typescript
const flags = {
    foobar: true
}
```

You can reference each sub-level feature as follows:

```tsx
<ComponentToggle<FoobarProps>
    feature="foobar/foo"
    foo="bar"
/>
```

and

```tsx
<ComponentToggle<FoobarProps>
    feature="foobar/bar"
    bar="foo"
/>
```

## How to include stylesheets in feature components

Importing stylesheets directly (e.g., `import './styles.css'`) must be avoided, because the bundler will preload it regardless of the feature flag configuration. Instead, you should use your bundler's URL import feature to load stylesheets dynamically.

For example, with Vite you can use the `?url` suffix:

```tsx
// Don't do this:
import './styles.css'  // ❌ Will be loaded regardless of feature flag

// Do this instead:
import stylesheetUrl from './styles.css?url'  // ✅ Will be loaded only when needed

// Then use your preferred method to inject the stylesheet
// For example, you could use react-helmet, or create a style tag dynamically:
const MyComponent = () => {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = stylesheetUrl
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  return <div>My component content</div>
}