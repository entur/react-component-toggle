import { SandboxComponent } from '../../../lib/components/SandboxFeature/types'
import type { ButtonFeatureProps } from './types'

const Button: SandboxComponent<{ button: boolean }, ButtonFeatureProps> = ({
  label,
  onClick,
  className = '',
}) => {
  return (
    <button
      className={`sandbox-button ${className}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}

// Need to export as default for dynamic import to work
export default Button
