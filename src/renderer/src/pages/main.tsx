'use client'
import { useEffect } from 'react'
import { getSession, removeSession } from '@renderer/actions'
import { supabase } from '@renderer/actions/supabase'
import { useNavigate } from 'react-router-dom'
import HeaderNavbar from '@renderer/components/header'

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

  // useEffect(() => {
  //   // Definición simplificada de la función sin tipo específico para evitar el error de 'InfoDeviceCallback' no encontrado
  //   const handleInfoDeviceLocal = (_event: Electron.IpcRendererEvent, result: string) => {
  //     const info = JSON.parse(result)
  //     console.log('Device Info:', info)
  //   }

  //   window.api.onInfoDeviceLocal(handleInfoDeviceLocal)

  //   return () => {
  //     // Ajuste para pasar una función dummy que cumple con la firma esperada en lugar de null
  //     window.api.onInfoDeviceLocal(() => {})
  //   }
  // }, [])

  // function getInfoDeviceFunction() {
  //   window.api.getInfoDeviceLocal()
  // }

  return (
    <main className="flex w-screen h-screen justify-center items-center">
      <HeaderNavbar />
      <h1>Main Page</h1>
    </main>
  )
}
