import { FeatureComponent } from '../../../lib/components/FeatureGate/types'
import { ButtonFeatureProps } from './types'
import { FeatureFlags } from '../../config/config'

const Button: FeatureComponent<FeatureFlags, ButtonFeatureProps> = ({
  label,
  onClick,
}) => {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  )
}

// Need to export as default for dynamic import to work
export default Button
