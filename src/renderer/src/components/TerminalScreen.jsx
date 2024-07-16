import { useEffect, useRef, useState } from 'react'
import '../assets/terminal.css'
import { useSelector } from 'react-redux'

const TerminalScreen = () => {
  const [output, setOutput] = useState('')
  const terminalRef = useRef(null)
  const [input, setInput] = useState('')
  const { path } = useSelector((state) => state.files)

  const handleInputChange = (event) => {
    setInput(event.target.value)
  }

  const handleInputSubmit = async (event) => {
    if (event.key === 'Enter') {
      setOutput((prevOutput) => `${prevOutput.trim()}\n> ${input}`)
      if (input.trim() === 'cls') {
        setOutput('')
      }
      try {
        const { result, error } = await window.api.send(input)
        if (error) {
          setOutput((prevOutput) => `${prevOutput.trim()}\n ${error}`)
        } else {
          setOutput((prevOutput) => `${prevOutput.trim()}\n${result}`)
        }
      } catch (error) {
        setOutput((prevOutput) => `${prevOutput.trim()}\n ${error.message}`)
      }
      setInput('')
    }
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo(0, terminalRef.current.scrollHeight)
    }
  }, [output])
  return (
    <div
      ref={terminalRef}
      style={{
        backgroundColor: '#000',
        color: '#fff',
        height: '100vh',
        padding: '10px',
        overflow: 'auto'
      }}
    >
      {output.trim() && <pre>{output.trim()}</pre>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <pre>{path + '>'}</pre>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleInputSubmit}
          style={{
            width: '100%',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            outline: 'none',
            fontSize: 13,
            fontFamily: 'monospace',
            unicodeBidi: 'isolate'
          }}
          autoFocus
        />
      </div>
    </div>
  )
}

export default TerminalScreen
