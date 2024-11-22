import { FeatureComponent } from '../../../lib/main'
import { ButtonFeatureProps } from './types'

const Button: FeatureComponent<ButtonFeatureProps> = ({
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
