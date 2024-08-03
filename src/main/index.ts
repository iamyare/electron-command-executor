import { app, shell, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon_tray.png?asset'

// Importamos el icono de la aplicación de manera diferente para cada plataforma
const getIconPath = () => {
  if (process.platform === 'win32') {
    return join(__dirname, '../../resources/icon.ico')
  } else if (process.platform === 'darwin') {
    return join(__dirname, '../../resources/icon.icns')
  } else {
    return join(__dirname, '../../resources/icon.png')
  }
}

import { exec } from 'child_process'
import { getDeviceNameLocal, getMAC } from './actions'

let mainWindow: BrowserWindow
let tray: Tray
let isQuitting = false

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    center: true,
    title: 'Command Executor',
    vibrancy: 'under-window',
    autoHideMenuBar: true,
    transparent: true,
    frame: false,
    visualEffectState: 'active',
    icon: getIconPath(), // Usamos la función para obtener la ruta del icono
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  if (process.platform === 'darwin') {
    app.dock.setIcon(nativeImage.createFromPath(getIconPath()))
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Modificar el comportamiento de cierre
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow.hide()
      if (process.platform === 'darwin') {
        app.dock.hide()
      }
    }
    return false
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function createTray() {
  const trayIcon = nativeImage.createFromPath(icon)
  const scaledTrayIcon = trayIcon.resize({ width: 16, height: 16 })

  tray = new Tray(scaledTrayIcon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow.show()
        if (process.platform === 'darwin') {
          app.dock.show()
        }
      }
    },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true
        app.quit()
      }
    }
  ])
  tray.setToolTip('Command Executor')
  tray.setContextMenu(contextMenu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Establecer el icono de la aplicación para Windows
  if (process.platform === 'win32') {
    app.setAppUserModelId(process.execPath)
  }

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.on('execute-command', (event, command) => {
    exec(command, (error, stdout, stderr) => {
      let status = 'completed'
      let output = stdout

      if (error) {
        status = 'error'
        output = error.message
      } else if (stderr) {
        status = 'stderr'
        output = stderr
      }

      event.reply('command-result', JSON.stringify({ status: status, output: output }))
    })
  })

  ipcMain.on('get-info-device-local', (event) => {
    const MAC = getMAC()
    const DEVICE_NAME_LOCAL = getDeviceNameLocal()
    const OS = process.platform

    event.reply('info-device-local', JSON.stringify({ id: MAC, name: DEVICE_NAME_LOCAL, os: OS }))
  })

  ipcMain.on('minimize-app', () => {
    mainWindow.hide()
    if (process.platform === 'darwin') {
      app.dock.hide()
    }
  })

  createWindow()
  createTray()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Modificar el comportamiento de cierre de la aplicación
app.on('window-all-closed', (event: Electron.Event) => {
  event.preventDefault()
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
