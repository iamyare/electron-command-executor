import { networkInterfaces, NetworkInterfaceInfo, userInfo, platform } from 'os'
import { supabase } from '../supabase'

export function getMAC(): string {
  let macAddress = ''
  for (const interfaceKey in networkInterfaces()) {
    const networkInterface = networkInterfaces()[interfaceKey]
    const nonInternalInterface = networkInterface?.find(
      (net: NetworkInterfaceInfo) => !net.internal
    )
    if (nonInternalInterface) {
      macAddress = nonInternalInterface.mac
      break
    }
  }
  return macAddress
}

//obtener nombre del dispositivo de la computadora
export function getDeviceNameLocal(): string {
  return userInfo().username
}

//Obtener el sistema operativo de la computadora
export function getOS(): string {
  return platform()
}

//Buscar si hay un dispositivo con la direccion MAC
export async function findDevice({ mac }: { mac: string }) {
  const { data, error } = await supabase.from('devices').select('*').eq('id', mac).single()
  return { data, error }
}

//Crear un nuevo dispositivo
export async function createDevice({
  mac,
  name,
  os,
  user_id
}: {
  mac: string
  name: string
  os: string
  user_id: string
}) {
  const { data, error } = await supabase.from('devices').insert({
    id: mac,
    name: name,
    user_id: user_id,
    os: os
  })
  return { data, error }
}
