import { useRef } from 'react'
import '../assets/control.css'
import { useOutside } from '../utils/utils'
import PropTypes from 'prop-types'

const Control = ({ closeModal }) => {
  const ref = useRef(null)
  useOutside(ref, closeModal)
  const openTerminal = () => {}
  return (
    <div ref={ref} className="control">
      <button onClick={openTerminal}>Open terminal</button>
      <button>Open terminal</button>
      <button>Open terminal</button>
      <button>Open terminal</button>
    </div>
  )
}
Control.propTypes = {
  closeModal: PropTypes.func
}
export default Control
