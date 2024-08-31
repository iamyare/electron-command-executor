import { supabase } from './supabase'
import CryptoJS from 'crypto-js'

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY ?? 'secret'

interface EncryptParams {
  text: string
  action: 'encrypt' | 'decrypt'
}

function generateDeterministicUUIDLike(input: string): string {
  // Utilizamos HMAC-SHA256 para generar un hash determinista
  const hmac = CryptoJS.HmacSHA256(input, SECRET_KEY)
  const hash = hmac.toString(CryptoJS.enc.Hex)

  // Formatea el hash para que se parezca a un UUID
  return `${hash.substr(0, 8)}-${hash.substr(8, 4)}-${hash.substr(12, 4)}-${hash.substr(16, 4)}-${hash.substr(20, 12)}`
}

export function encrypt({ text, action }: EncryptParams): string {
  if (action === 'encrypt') {
    // Verificamos si el texto se parece a una dirección MAC
    const isMacAddress = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(text)

    if (isMacAddress) {
      // Si es una dirección MAC, usamos la función determinista
      return generateDeterministicUUIDLike(text)
    } else {
      // Para otros tipos de texto, mantenemos la encriptación aleatoria
      const encrypted = CryptoJS.AES.encrypt(text, SECRET_KEY).toString()
      return generateDeterministicUUIDLike(encrypted)
    }
  } else {
    // La desencriptación se mantiene igual que antes
    const allParts = text.split('-').join('')
    // Intentamos desencriptar directamente (para MACs encriptadas)
    let decrypted = ''
    try {
      const bytes = CryptoJS.AES.decrypt(allParts, SECRET_KEY)
      decrypted = bytes.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      // Si falla, asumimos que es una MAC encriptada y no hacemos nada
      // Ya que no podemos revertir el HMAC
      decrypted = text
    }
    return decrypted
  }
}

interface SessionData {
  Session: boolean
  id: string
  deviceId: string
  expiresAt: number
}

export function getSession(): SessionData | null {
  const session = localStorage.getItem('Session')
  if (session) {
    const parsedSession = JSON.parse(session)
    parsedSession.id = encrypt({ text: parsedSession.id, action: 'decrypt' })
    return parsedSession
  }
  return null
}

export function setSession({
  sessionStatus,
  userId,
  deviceId
}: {
  sessionStatus: boolean
  userId: string
  deviceId: string
}) {
  const expirationTime = new Date().getTime() + 31 * 24 * 60 * 60 * 1000 // 31 días
  const sessionData = {
    Session: sessionStatus,
    id: encrypt({ text: userId, action: 'encrypt' }),
    deviceId: deviceId,
    expiresAt: expirationTime
  }
  localStorage.setItem('Session', JSON.stringify(sessionData))
}

export function removeSession() {
  localStorage.removeItem('Session')
}

export async function getSessionDevice() {
  const { data, error } = await supabase.auth.getSession()
  return { data, error }
}

export async function login({ email, password }: { email: string; password: string }) {
  const { data: user, error: userError } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { user, userError }
}
export async function verifyToken({ token }: { token: string }) {
  const { data, error } = await supabase.from('tokens').select('*').eq('id', token).single()
  return { data, error }
}

export async function deleteToken({ token }: { token: string }) {
  const { error } = await supabase.from('tokens').delete().eq('id', token)
  return { error }
}

//Enviar device a device
export async function sendDevice({ id, name, os, user_id }: DeviceInsert) {
  const newId = encrypt({ text: id, action: 'encrypt' })
  const { data: deviceInsert, error: errorDeviceInsert } = await supabase
    .from('devices')
    .insert({ id: newId, name, os, user_id })
    .select('*')
    .single()

  return { deviceInsert, errorDeviceInsert }
}

//Obtener información del dispositivo
export async function getInfoDevice({ deviceId }: { deviceId: string }) {
  const newId = encrypt({ text: deviceId, action: 'encrypt' })
  const { data: deviceInfo, error } = await supabase
    .from('devices')
    .select('*')
    .eq('id', newId)
    .single()
  return { deviceInfo, error }
}

export async function getDevicesByUser({ userId }: { userId: string }) {
  const { data: devices, error: errorDevices } = await supabase
    .from('devices')
    .select('*')
    .eq('user_id', userId)
  return { devices, errorDevices }
}

export async function refreshSession() {
  const session = getSession()
  if (session) {
    const currentTime = new Date().getTime()
    if (currentTime > session.expiresAt) {
      // La sesión ha expirado, intentemos renovarla
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        removeSession()
        return false
      }
      // Renovar la sesión
      setSession({
        sessionStatus: true,
        userId: data.session.user.id,
        deviceId: session.deviceId
      })
      return true
    }
    return true
  }
  return false
}
