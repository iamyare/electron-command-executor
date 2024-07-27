import { supabase } from './supabase'

interface SessionData {
  Session: boolean
  id: string
}

export function getSession(): SessionData | null {
  const session = localStorage.getItem('Session')
  if (session) {
    return JSON.parse(session)
  }
  return null
}

export function setSession({ sessionStatus, userId }: { sessionStatus: boolean; userId: string }) {
  localStorage.setItem('Session', JSON.stringify({ Session: sessionStatus, id: userId }))
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
