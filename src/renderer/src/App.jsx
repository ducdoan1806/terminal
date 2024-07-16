import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import fileSlice from './api/fileSlice'
import './assets/app.css'
import Sidebar from './components/Sidebar'
// import TerminalScreen from './components/TerminalScreen'
import Player from './components/Player'

function App() {
  const dispatch = useDispatch()
  const { path } = useSelector((state) => state.files)

  window.api.receive('get-dir', (message) => {
    dispatch(fileSlice.actions.getFiles(message))
  })
  useEffect(() => {
    window.api.readDir(path)
  }, [path])
  return (
    <div className="app">
      <Sidebar />
      <div className="app__main">
        {/* <TerminalScreen /> */}
        <Player />
      </div>
    </div>
  )
}

export default App
