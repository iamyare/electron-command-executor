import { zodResolver } from '@hookform/resolvers/zod'
import { verifyToken } from '@renderer/actions'
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
import { z } from 'zod'

const FormSchema = z.object({
  token: z.string().min(6)
})

export default function FormLogin() {
  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      token: ''
    }
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(() => {
      ;(async () => {
        // Se elimina el punto y coma inicial innecesario
        const { data: result, error: errorResult } = await verifyToken({ token: data.token })
        if (errorResult) {
          toast({ title: 'Error', description: errorResult.message })
          return // Asegura que la función termina después de mostrar el toast en caso de error
        }
        if (!result) {
          toast({ title: 'Error', description: 'Invalid token' })
          return // Asegura que la función termina después de mostrar el toast en caso de token inválido
        }
        toast({
          title: 'You submitted the following values:',
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(data, null, 2)}</code>
            </pre>
          )
        })
      })() // Se invoca correctamente la función asíncrona
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
