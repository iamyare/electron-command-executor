'use client'
import { useEffect } from 'react'
import { getSession, removeSession } from '@renderer/actions'
import { supabase } from '@renderer/actions/supabase'
import { useNavigate } from 'react-router-dom'
import LogOut from '@renderer/components/log-out'

export default function MainPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const session = getSession()
    if (!session) {
      removeSession()
      navigate('/auth/login')
      return
    }

    const subscription = supabase
      .channel('command-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'command_history',
          filter: `user_id=eq.${session.id}`
        },
        async (payload) => {
          const commandId = payload.new.command_id
          console.log('commandId', commandId)
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
          window.api.sendCommand(command)

          window.api.onCommandResult(async (result) => {
            await supabase
              .from('command_history')
              .update({ status: 'completed', output: result, updated_at: new Date().toISOString() })
              .eq('id', payload.new.id)
          })
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  function getInfoDeviceFunction() {
    // Inicia el proceso asíncrono
    window.api.getInfoDeviceLocal()
    // Escucha la respuesta del proceso asíncrono
    window.api.onInfoDeviceLocal((result) => {
      console.log('result', result)
    })
  }

  return (
    <main className="flex w-screen h-screen justify-center items-center">
      <header className="fixed top-0 left-0 w-screen p-4">
        <LogOut />
        <button onClick={getInfoDeviceFunction}>Get Info Device</button>
      </header>
      <h1>Main Page</h1>
    </main>
  )
}
