import { useState } from 'react'
import { ComponentToggleProvider, ToggleFlags, ComponentToggle } from '../lib/main'
import type { ButtonProps } from './ext/myfeature/button/types';
import './App.css'

interface MyFeatures extends ToggleFlags {
  myfeature: boolean;
}


export function App() {
  const [count, setCount] = useState(0)
  const [featureEnabled, setFeatureEnabled] = useState(false)

  const toggleFlags: MyFeatures = {
    myfeature: featureEnabled
  }

  return (
    <ComponentToggleProvider flags={toggleFlags} importFn={(featurePathComponents) => {
      if (featurePathComponents.length === 1) {
        return import(`./ext/${featurePathComponents[0]}/index.ts`);
      } else if (featurePathComponents.length === 2) {
        return import(`./ext/${featurePathComponents[0]}/${featurePathComponents[1]}/index.ts`)
      } else {
        throw new Error("Max feature depth is 2");
      }
      }} maxFeatureDepth={2}>
      <div>
        <h1>Sandbox Feature Demo</h1>
        <div className="feature-toggle">
          <label>
            <input
              type="checkbox"
              checked={featureEnabled}
              onChange={(e) => setFeatureEnabled(e.target.checked)}
            />
            Enable Button Feature
          </label>
        </div>
        <div className="card">
          <ComponentToggle<ButtonProps, MyFeatures>
            feature="myfeature/button"
            renderFallback={() => <button>Button feature is disabled</button>}
            componentProps={{
              label: `I was clicked ${count} times! Click me again!`,
              onClick: () => setCount(count + 1)
            }}
          />
        </div>
      </div>
    </ComponentToggleProvider>
  )
}

export default App
