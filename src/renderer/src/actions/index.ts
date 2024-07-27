import { supabase } from './supabase'
import CryptoJS from 'crypto-js'

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY ?? 'secret'

interface EncryptParams {
  text: string
  action: 'encrypt' | 'decrypt'
}

function generateUUIDLike(input: string): string {
  const hash = CryptoJS.SHA256(input)
  const hashHex = hash.toString(CryptoJS.enc.Hex)

  // Formatea el hash para que se parezca a un UUID
  return `${hashHex.substr(0, 8)}-${hashHex.substr(8, 4)}-${hashHex.substr(12, 4)}-${hashHex.substr(16, 4)}-${hashHex.substr(20, 12)}`
}

export function encrypt({ text, action }: EncryptParams): string {
  if (action === 'encrypt') {
    const encrypted = CryptoJS.AES.encrypt(text, SECRET_KEY).toString()
    return generateUUIDLike(encrypted)
  } else {
    // Para desencriptar, primero necesitamos convertir el UUID-like back a la forma encriptada
    const allParts = text.split('-').join('')
    const encryptedText = CryptoJS.enc.Hex.parse(allParts).toString(CryptoJS.enc.Base64)
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  }
}

interface SessionData {
  Session: boolean
  id: string
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

export function setSession({ sessionStatus, userId }: { sessionStatus: boolean; userId: string }) {
  localStorage.setItem(
    'Session',
    JSON.stringify({ Session: sessionStatus, id: encrypt({ text: userId, action: 'encrypt' }) })
  )
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
  console.log('newId', newId)
  const { data: deviceInsert, error: errorDeviceInsert } = await supabase
    .from('devices')
    .insert({ id: newId, name, os, user_id })
    .single()

  return { deviceInsert, errorDeviceInsert }
}
