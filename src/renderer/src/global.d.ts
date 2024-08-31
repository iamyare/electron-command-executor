import { type Database as DB } from './actions/supabase/database.types'

declare global {
  type Database = DB
  type Device = DB['public']['Tables']['devices']['Row']
  type DeviceInsert = DB['public']['Tables']['devices']['Insert']

  type DeviceInfoType = {
    id: string
    name: string
    os: string
  }

  interface Window {
    api: {
      sendCommand: (command: string) => void
      onCommandResult: (callback: (result: string) => void) => void
      getInfoDeviceLocal: () => void
      onInfoDeviceLocal: (
        callback: (_event: Electron.IpcRendererEvent, result: string) => void
      ) => void
      minimizeApp: () => void
      getAutoLaunch: () => Promise<boolean>
      setAutoLaunch: (enable: boolean) => void
    }
  }
}
