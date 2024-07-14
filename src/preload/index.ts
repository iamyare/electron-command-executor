import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

type Command = string
type CommandResultCallback = (event: Electron.IpcRendererEvent, result: string) => void
type InfoDeviceCallback = (event: Electron.IpcRendererEvent, result: string) => void

// Custom APIs for renderer
const api = {
  sendCommand: (command: Command) => ipcRenderer.send('execute-command', command),
  onCommandResult: (callback: CommandResultCallback) => ipcRenderer.on('command-result', callback),
  getInfoDeviceLocal: () => ipcRenderer.send('get-info-device-local'),
  onInfoDeviceLocal: (callback: InfoDeviceCallback) =>
    ipcRenderer.on('info-device-local', (event, result) => callback(event, result))
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

contextBridge.exposeInMainWorld('api', api)
