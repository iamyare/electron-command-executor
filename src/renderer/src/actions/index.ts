import { supabase } from './supabase'
import crypto from 'crypto'

export async function encrypt({
  text,
  action
}: {
  text: string
  action: 'encrypt' | 'decrypt'
}): Promise<string> {
  const secret = import.meta.env.VITE_SECRET_KEY ?? ''
  const algorithm = { name: 'AES-CBC', length: 256 }
  const iv = new Uint8Array(16) // El IV debe ser único y seguro, pero aquí usamos un valor estático para simplificar

  // Deriva la clave usando PBKDF2
  const baseKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new TextEncoder().encode('salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    algorithm,
    false,
    ['encrypt', 'decrypt']
  )

  if (action === 'encrypt') {
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-CBC', iv },
      key,
      new TextEncoder().encode(text)
    )
    return Buffer.from(encrypted).toString('hex')
  } else {
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv },
      key,
      Buffer.from(text, 'hex')
    )
    return new TextDecoder().decode(decrypted)
  }
}

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
