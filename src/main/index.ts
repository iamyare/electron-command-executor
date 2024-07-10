import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { supabase } from './supabase'
import { exec } from 'child_process'
import { createDevice, encrypt, findDevice, getDeviceNameLocal, getMAC } from './actions'

let mainWindow: BrowserWindow

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    center: true,
    title: 'Electron Toolkit',
    vibrancy: 'under-window',
    autoHideMenuBar: true,
    transparent: true,
    frame: false,
    visualEffectState: 'active',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
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
  // ipcMain.on('ping', () => console.log('pong'))

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

// Escuchar eventos de Supabase
const userId = '6428ab79-6446-4b1f-a968-6d2246426728' // Reemplaza con el ID del usuario actual
supabase
  .channel('command-channel')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'command_history',
      filter: `user_id=eq.${userId}`
    },
    async (payload) => {
      const commandId = payload.new.command_id
      const { data: commandData, error } = await supabase
        .from('commands')
        .select('command')
        .eq('id', commandId)
        .single()

      if (error) {
        console.error('Error fetching command:', error)
        return
      }

      const command = commandData.command
      exec(command, async (error, stdout, stderr) => {
        let status = 'completed'
        let output = stdout

        if (error) {
          status = 'error'
          output = error.message
        } else if (stderr) {
          status = 'stderr'
          output = stderr
        }

        await supabase
          .from('command_history')
          .update({ status, output, updated_at: new Date().toISOString() })
          .eq('id', payload.new.id)

        mainWindow.webContents.send(
          'command-result',
          JSON.stringify({ status: status, output: output })
        )
      })
    }
  )
  .subscribe()

//Obtener direccion MAC de la computadora
const MAC = getMAC()
const ENCRYPT_MAC = encrypt({ text: MAC, secret: userId, action: 'encrypt' })
const DEVICE_NAME_LOCAL = getDeviceNameLocal()
const OS = process.platform

// const encriptar = encrypt({ text: getMAC(), secret: 'secret', action: 'encrypt' })
// console.log(encrypt({ text: encriptar, secret: 'secret', action: 'decrypt' }))

async function hola() {
  const { data: dataDevice, error: errorDevice } = await findDevice({ mac: ENCRYPT_MAC })
  if (errorDevice) {
    const { data: deviceCreator, error: errorCreateDevice } = await createDevice({
      mac: ENCRYPT_MAC,
      name: DEVICE_NAME_LOCAL,
      os: OS,
      user_id: userId
    })
    if (errorCreateDevice) {
      console.error('Error creating device:', errorCreateDevice)
      return
    }
    console.log(`Device created: ${JSON.stringify(deviceCreator)}`)
  }
  console.log(`Device found: ${JSON.stringify(dataDevice)}`)
}

console.log(hola())
