import { zodResolver } from '@hookform/resolvers/zod'
import { deleteToken, setSession, verifyToken } from '@renderer/actions'
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
import { useTransition } from 'react'
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

  function getInfoDeviceFunction() {
    window.api.getInfoDevice()

    window.api.onInfoDevice(async (result) => {
      console.log('info-device', result)
    })
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(() => {
      ;(async () => {
        const { data: result, error: errorResult } = await verifyToken({ token: data.token })
        if (errorResult) {
          if (errorResult.code === 'PGRST116') {
            toast({ title: 'Error', description: 'Token not found' })
            return // Asegura que la función termina después de mostrar el toast en caso de token expirado
          }
          toast({ title: 'Error', description: errorResult.message })
          return // Asegura que la función termina después de mostrar el toast en caso de error
        }
        if (!result) {
          toast({ title: 'Error', description: 'Token not found' })
          return // Asegura que la función termina después de mostrar el toast en caso de token no
        }

        //si el token ya pasó 30 minutos de expiración se muestra un mensaje de error
        if (new Date(result.created_at).getTime() + 30 * 60000 < new Date().getTime()) {
          toast({ title: 'Error', description: 'Token expired' })
          //eliminar token
          await deleteToken({ token: data.token })
          return // Asegura que la función termina después de mostrar el toast en caso de token expirado
        }

        //crear un localStorage que se inicio sesion con el id del usuario, tiene que contener: Session: true, id: id del usuario como json
        setSession({ sessionStatus: true, userId: result.user_id })
        //Agregar dispositivo a la base de datos
        navigation('/')
      })()
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex flex-col items-center space-y-6"
      >
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
