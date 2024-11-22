import { useState } from 'react'
import { ComponentToggleProvider, ToggleFlags, ComponentToggle } from '../lib/main'
import type { ButtonFeatureProps } from './ext/button/types'
import type { MyFeatures } from './config'
import './App.css'


export function App() {
  const [count, setCount] = useState(0)
  const [featureEnabled, setFeatureEnabled] = useState(false)

  const toggleFlags: ToggleFlags = {
    button: featureEnabled
  }

  return (
    <ComponentToggleProvider flags={toggleFlags} componentsPath="/src/ext">
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
          <ComponentToggle<MyFeatures, ButtonFeatureProps>
            feature="button"
            label={`I was clicked ${count} times! Click me again!`}
            onClick={() => setCount(count + 1)}
            renderFallback={() => <button>Button feature is disabled</button>}
          />
        </div>
      </div>
    </ComponentToggleProvider>
  )
}

export default App
