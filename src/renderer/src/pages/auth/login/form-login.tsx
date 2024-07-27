import { useEffect, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { deleteToken, sendDevice, setSession, verifyToken } from '@renderer/actions'
import { Button } from '@renderer/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@renderer/components/ui/input-otp'
import { toast } from '@renderer/components/ui/use-toast'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'
import { Loader, LogIn } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

const FormSchema = z.object({
  token: z.string().min(6)
})

export default function FormLogin() {
  const [isPending, startTransition] = useTransition()
  const navigation = useNavigate()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      token: ''
    }
  })

  useEffect(() => {
    const handleInfoDeviceLocal = (_event: Electron.IpcRendererEvent, result: string) => {
      const info = JSON.parse(result)
      console.log('Device Info:', info)
      // Aquí puedes manejar la información del dispositivo si es necesario
    }

    window.api.onInfoDeviceLocal(handleInfoDeviceLocal)

    return () => {
      window.api.onInfoDeviceLocal(() => {})
    }
  }, [])

  function getInfoDeviceFunction(): Promise<DeviceInfoType> {
    return new Promise((resolve) => {
      const handleInfoDeviceLocal = (_event: Electron.IpcRendererEvent, result: string) => {
        const info = JSON.parse(result)
        resolve(info)
        window.api.onInfoDeviceLocal(() => {}) // Limpia el listener después de recibir la info
      }

      window.api.onInfoDeviceLocal(handleInfoDeviceLocal)
      window.api.getInfoDeviceLocal()
    })
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(() => {
      ;(async () => {
        const { data: result, error: errorResult } = await verifyToken({ token: data.token })
        if (errorResult) {
          if (errorResult.code === 'PGRST116') {
            toast({ title: 'Error', description: 'Token not found' })
            return
          }
          toast({ title: 'Error', description: errorResult.message })
          return
        }
        if (!result) {
          toast({ title: 'Error', description: 'Token not found' })
          return
        }

        if (new Date(result.created_at).getTime() + 30 * 60000 < new Date().getTime()) {
          toast({ title: 'Error', description: 'Token expired' })
          await deleteToken({ token: data.token })
          return
        }

        await deleteToken({ token: data.token })

        // Obtener información del dispositivo
        const deviceInfo = await getInfoDeviceFunction()

        // Enviar información del dispositivo
        const { deviceInsert, errorDeviceInsert } = await sendDevice({
          id: deviceInfo.id,
          name: deviceInfo.name,
          os: deviceInfo.os,
          user_id: result.user_id
        })

        if (errorDeviceInsert) {
          console.error('Error al enviar información del dispositivo:', errorDeviceInsert)
          toast({ title: 'Warning', description: 'Unable to send device information' })
        } else {
          console.log('Información del dispositivo enviada:', deviceInsert)
        }

        setSession({ sessionStatus: true, userId: result.user_id })
        navigation('/')
      })()
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center space-y-6">
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <FormLabel>Token</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                We sent a 6-digit code to your email. Please enter it here.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {isPending ? (
            <Loader className="size-4 animate-spin mr-2" />
          ) : (
            <LogIn className="size-4 mr-2" />
          )}
          Verify
        </Button>
      </form>
    </Form>
  )
}
