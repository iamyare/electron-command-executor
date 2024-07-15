import { type Database as DB } from './actions/supabase/database.types'

declare global {
  type Database = DB
  interface Window {
    api: {
      sendCommand: (command: string) => void
      onCommandResult: (callback: (result: string) => void) => void
      getInfoDeviceLocal: () => void
      onInfoDeviceLocal: (
        callback: (_event: Electron.IpcRendererEvent, result: string) => void
      ) => void
    }
  }
}
