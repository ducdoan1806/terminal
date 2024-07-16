import { useEffect, useRef, useState } from 'react'
import '../assets/terminal.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
const TerminalScreen = () => {
  const ref = useRef()
  const [term, setTerm] = useState(null)
  const terminal = useRef(null)
  const fitAddon = useRef(null)
  useEffect(() => {
    const terminal = new Terminal()
    setTerm(terminal)
    return () => {
      if (terminal) {
        terminal.dispose()
      }
    }
  }, [])
  useEffect(() => {
    if (term) {
      terminal.current = new Terminal()
      fitAddon.current = new FitAddon()

      terminal.current.loadAddon(fitAddon.current)
      terminal.current.open(ref.current)
      fitAddon.current.fit()
      let input = ''
      window.api.onTerminalOutput((data) => {
        terminal.current.write(data)
      })
      terminal.current.onData((data) => {
        if (data === '\r') {
          window.api.sendTerminalCmd(input)
          input = ''
          terminal.current.write('\r\n')
        } else if (data === '\u007f') {
          if (input.length > 0) {
            input = input.slice(0, -1)
            terminal.current.write('\b\b')
          }
        } else {
          input += data
          terminal.current.write(data)
        }
      })

      return () => {
        terminal.current.dispose()
      }
    }
  }, [term])
  return <div ref={ref} style={{ width: '100%', height: '100%' }}></div>
}

export default TerminalScreen
