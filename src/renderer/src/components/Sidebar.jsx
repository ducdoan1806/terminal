import '../assets/sidebar.css'
import arrowRight from '../assets/icons/arrowRight.svg'

import { useDispatch, useSelector } from 'react-redux'
import SidebarItem from './SidebarItem'
import fileSlice from '../api/fileSlice'
import { useState } from 'react'

const Sidebar = () => {
  const { files, path } = useSelector((state) => state.files)

  const [pathInput, setPathInput] = useState(path)
  const dispatch = useDispatch()

  return (
    <div className="sidebar">
      <div className="sidebar__input">
        <input
          type="text"
          placeholder="Type path folder..."
          value={pathInput}
          onChange={(e) => {
            setPathInput(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key == 'Enter') {
              let text = pathInput
              if (!text.endsWith('/')) {
                text += '/'
                setPathInput(text)
              }
              dispatch(fileSlice.actions.setPath(text))
            }
          }}
        />
        <img width={20} height={20} src={arrowRight} alt="" />
      </div>
      <div className="sidebar__main">
        <SidebarItem
          name="..."
          url={''}
          isFile={false}
          pathInput={pathInput}
          setPathInput={setPathInput}
        />
        {files.map((item) => (
          <SidebarItem key={item.url} {...item} setPathInput={setPathInput} pathInput={pathInput} />
        ))}
      </div>
    </div>
  )
}

export default Sidebar
