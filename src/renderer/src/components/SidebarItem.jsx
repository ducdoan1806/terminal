import PropTypes from 'prop-types'
import '../assets/sidebarItem.css'
import folderIcon from '../assets/icons/folder.svg'
import fileIcon from '../assets/icons/file.svg'
import { useDispatch } from 'react-redux'
import fileSlice from '../api/fileSlice'
import { rootDirectory } from '../utils/const'
import { useState } from 'react'
import Control from './Control'

const SidebarItem = ({ name, url, isFile, setPathInput, pathInput }) => {
  const [isSelect, setIsSelect] = useState(false)
  const dispatch = useDispatch()
  const onDoubleClickHandler = async () => {
    let newUrl = ''
    if (name === '...') {
      if (rootDirectory.includes(pathInput)) {
        newUrl = pathInput
      } else {
        let trimmedUrl = pathInput.endsWith('/') ? pathInput.slice(0, -1) : pathInput
        newUrl = trimmedUrl.substring(0, trimmedUrl.lastIndexOf('/'))
        newUrl = newUrl.endsWith('/') ? newUrl : newUrl + '/'
      }
    } else newUrl = url.endsWith('/') ? url : url + '/'

    const res = await window.api.checkFolderAccess(newUrl)
    if (res.accessible && !isFile) {
      setPathInput(newUrl)
      dispatch(fileSlice.actions.setPath(newUrl))
    }
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
    setIsSelect(true)
  }
  return (
    <div
      className={'sidebarItem'}
      onDoubleClick={onDoubleClickHandler}
      onContextMenu={handleContextMenu}
    >
      <img width={20} height={20} src={isFile ? fileIcon : folderIcon} alt="" />
      <div title={url} className="sidebarItem__name">
        {name}
      </div>
      {isSelect && name !== '...' && (
        <Control
          closeModal={() => {
            setIsSelect(false)
          }}
        />
      )}
    </div>
  )
}
SidebarItem.propTypes = {
  name: PropTypes.string,
  url: PropTypes.string,
  isFile: PropTypes.bool,
  setPathInput: PropTypes.func,
  pathInput: PropTypes.string
}
export default SidebarItem
