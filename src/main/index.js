import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
const { exec } = require('child_process')
const fs = require('fs')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.handle('read-dir', async (event, dirPath) => {
    fs.readdir(dirPath, (err, files) => {
      const result = []
      if (!err) {
        files.forEach((item) => {
          const isFile = fs.lstatSync(dirPath + item).isFile()
          result.push({
            name: item,
            url: dirPath + item,
            isFile
          })
        })
      }
      result.sort((a, b) => a.isFile - b.isFile)
      invokeFunctionInRenderer(result)
    })
  })
  ipcMain.handle('check-folder-access', async (event, folderPath) => {
    try {
      await fs.promises.access(folderPath, fs.constants.R_OK | fs.constants.W_OK)
      return { accessible: true }
    } catch (err) {
      return { accessible: false, error: err.message }
    }
  })
  ipcMain.handle('execute-command', async (event, command) => {
    try {
      const { stdout, stderr } = await executeCommand(command)
      if (stderr) {
        return { error: stderr }
      }
      return { result: stdout }
    } catch (error) {
      return { error: error.message }
    }
  })

  async function executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error)
        } else {
          resolve({ stdout, stderr })
        }
      })
    })
  }
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
function invokeFunctionInRenderer(message) {
  const windows = BrowserWindow.getAllWindows()
  if (windows.length > 0) {
    windows[0].webContents.send('get-dir', message)
  }
}
