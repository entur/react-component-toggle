import * as types from './types.ts';

export const Button: types.Button = ({
  label,
    onClick
}) => {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  )
}
