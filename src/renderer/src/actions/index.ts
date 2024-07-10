import { supabase } from './supabase'

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
